//
//  CameraModel.swift
//  Disposable
//
//  Created by Clementine CUREL on 15/01/2025.
//

import AVFoundation
import UIKit
import FirebaseStorage
import FirebaseFirestore

class CameraModel: NSObject, ObservableObject {
    @Published var session = AVCaptureSession()
    @Published var previewLayer: AVCaptureVideoPreviewLayer?
    @Published var output = AVCapturePhotoOutput()
    @Published var previewImage: UIImage?
    @Published var currentCameraPosition: AVCaptureDevice.Position = .back
    @Published var isFlashOn: Bool = false
    @Published var maxPhotos: Int = 0
    @Published var remainingPhotos: Int = 0

    
    // These get set externally by your CameraView
    @Published var eventID: String = "unknownEvent"
    @Published var userName: String = "unknownuser"
    
    private let captureSessionQueue = DispatchQueue(label: "CaptureSessionQueue")
    private let storage = Storage.storage()
    private let db = Firestore.firestore()  // We'll need Firestore to create a doc
    
    override init() {
        super.init()
        setupCamera()
    }
    
    // MARK: - Camera Setup
    func setupCamera() {
        captureSessionQueue.async {
            self.session.beginConfiguration()
            
            guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera,
                                                           for: .video,
                                                           position: .back),
                  let videoInput = try? AVCaptureDeviceInput(device: videoDevice) else {
                print("Failed to access back camera.")
                return
            }
            
            if self.session.canAddInput(videoInput) {
                self.session.addInput(videoInput)
            }
            if self.session.canAddOutput(self.output) {
                self.session.addOutput(self.output)
            }
            
            self.session.commitConfiguration()
        }
    }
    
    // MARK: - Permissions
    func checkPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            startSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                if granted {
                    self.startSession()
                } else {
                    print("Camera access denied by user.")
                }
            }
        default:
            print("Camera permission denied or restricted.")
        }
    }
    
    // MARK: - Start/Stop Session
    func startSession() {
        captureSessionQueue.async {
            self.session.startRunning()
            print("Camera session started.")
        }
    }
    
    func stopSession() {
        captureSessionQueue.async {
            self.session.stopRunning()
            print("Camera session stopped.")
        }
    }
    
    // MARK: - Capture Photo

    func takePhoto() {
        guard remainingPhotos > 0 else {
            print("No remaining photos.")
            return
        }
        
        let settings = AVCapturePhotoSettings()
        settings.flashMode = isFlashOn && currentCameraPosition == .back ? .on : .off
        
        output.capturePhoto(with: settings, delegate: self)
        
        // Decrement remaining photos and sync with Firebase
        DispatchQueue.main.async {
//            self.remainingPhotos -= 1
            self.updateRemainingPhotosInFirebase()
        }
    }

    private func updateRemainingPhotosInFirebase() {
        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventID)
        
        let userRef = eventRef.collection("participants").whereField("name", isEqualTo: self.userName)
        
        userRef.getDocuments { snapshot, error in
            if let snapshot = snapshot, let doc = snapshot.documents.first {
                let participantRef = doc.reference
                participantRef.updateData(["photosTaken": self.maxPhotos - self.remainingPhotos]) { error in
                    if let error = error {
                        print("Failed to update remaining photos: \(error.localizedDescription)")
                    } else {
                        print("Updated remaining photos in Firebase.")
                    }
                }
            }
        }
    }


    private func simulateFrontCameraFlash(completion: @escaping () -> Void) {
            guard let window = UIApplication.shared.windows.first else {
                completion()
                return
            }

            let originalBrightness = UIScreen.main.brightness
            UIScreen.main.brightness = 1.0

            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                completion()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    UIScreen.main.brightness = originalBrightness
                }
            }
        }
    
    private func capturePhoto() {
        let settings = AVCapturePhotoSettings()
        settings.flashMode = isFlashOn && currentCameraPosition == .back ? .on : .off
        output.capturePhoto(with: settings, delegate: self)
    }


    
    // MARK: - Retake Photo
    func retakePhoto() {
        previewImage = nil
    }
    
    // MARK: - Save Photo (Storage + Firestore)
    func savePhoto() {
        self.remainingPhotos -= 1
        guard let image = previewImage else {
            print("No preview image to save.")
            return
        }
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            print("Failed to convert UIImage to JPEG.")
            return
        }
        
        let imageName = "\(UUID().uuidString).jpg"
        
        let storageRef = storage.reference()
            .child("events/\(eventID)/\(imageName)")
        
        let metadata = StorageMetadata()
        metadata.contentType = "image/jpeg"
        metadata.customMetadata = [
            "time": ISO8601DateFormatter().string(from: Date()),
            "eventId": eventID,
            "user": userName
        ]
        
        storageRef.putData(data, metadata: metadata) { [weak self] _, error in
            guard let self = self else { return }
            if let error = error {
                print("Error uploading image: \(error.localizedDescription)")
                return
            }
            print("Image uploaded to /events/\(self.eventID)/\(imageName)!")
            
            storageRef.downloadURL { url, err in
                if let err = err {
                    print("Failed to get download URL: \(err.localizedDescription)")
                    return
                }
                guard let downloadURL = url else { return }
                
                let docRef = self.db
                    .collection("events")
                    .document(self.eventID)
                    .collection("images")
                    .document() // auto-gen an ID
                
                let photoDoc: [String: Any] = [
                    "url": downloadURL.absoluteString,
                    "owner": self.userName,
                    "timestamp": Date().timeIntervalSince1970
                ]
                
                docRef.setData(photoDoc) { docError in
                    if let docError = docError {
                        print("Error creating Firestore doc: \(docError.localizedDescription)")
                    } else {
                        print("Firestore doc created in events/\(self.eventID)/images")
                    }
                }
            }
        }
        
        previewImage = nil
    }
    // MARK: - camera switch
    func switchCamera() {
        captureSessionQueue.async { [weak self] in
            guard let self = self else { return }
            
            self.session.beginConfiguration()

            // Remove all existing inputs
            self.session.inputs.forEach { self.session.removeInput($0) }

            // Determine new camera position
            let newPosition: AVCaptureDevice.Position = (self.currentCameraPosition == .back) ? .front : .back

            // Select the new camera device
            guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: newPosition),
                  let videoInput = try? AVCaptureDeviceInput(device: videoDevice) else {
                print("Failed to switch to \(newPosition == .back ? "back" : "front") camera.")
                return
            }

            // Add the new input
            if self.session.canAddInput(videoInput) {
                self.session.addInput(videoInput)
            }

            // Ensure the output is added
            if self.session.canAddOutput(self.output) {
                self.session.addOutput(self.output)
            }

            // Commit the configuration
            self.session.commitConfiguration()

            // Update the current camera position
            DispatchQueue.main.async {
                self.currentCameraPosition = newPosition
            }
        }
    }
    
    // MARK: - flash
    func toggleFlash() {
        if currentCameraPosition == .front {
            // Enable flash simulation for front camera
            isFlashOn.toggle()
            print("Front camera flash simulation \(isFlashOn ? "enabled" : "disabled").")
        } else {
            // Enable hardware flash for back camera
            guard let device = AVCaptureDevice.default(for: .video), device.hasTorch else {
                print("Flash is not supported on this device.")
                return
            }

            do {
                try device.lockForConfiguration()
                device.torchMode = isFlashOn ? .off : .on
                isFlashOn.toggle()
                device.unlockForConfiguration()
            } catch {
                print("Failed to toggle flash: \(error.localizedDescription)")
            }
        }
    }
    
    // MARK: - remaining photos
    func fetchRemainingPhotos() {
        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventID)
        
        eventRef.getDocument { document, error in
            if let document = document, document.exists,
               let eventData = document.data(),
               let maxPhotos = eventData["numberOfPhotos"] as? Int {
                
                self.maxPhotos = maxPhotos
                
                let userRef = eventRef.collection("participants").whereField("name", isEqualTo: self.userName)
                
                userRef.getDocuments { snapshot, error in
                    if let snapshot = snapshot, !snapshot.documents.isEmpty {
                        let takenPhotos = snapshot.documents.first?.data()["photosTaken"] as? Int ?? 0
                        DispatchQueue.main.async {
                            self.remainingPhotos = maxPhotos - takenPhotos
                        }
                    }
                }
            }
        }
    }
}


// MARK: - AVCapturePhotoCaptureDelegate
extension CameraModel: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput,
                     didFinishProcessingPhoto photo: AVCapturePhoto,
                     error: Error?) {
        
        if let error = error {
            print("Error capturing photo: \(error.localizedDescription)")
            return
        }
        
        guard let data = photo.fileDataRepresentation(),
              let image = UIImage(data: data) else {
            print("Failed to convert photo buffer to UIImage.")
            return
        }
        
        DispatchQueue.main.async {
            self.previewImage = image
            print("Photo captured and stored in previewImage.")
        }
    }
}
