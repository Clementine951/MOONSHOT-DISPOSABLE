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
        let settings = AVCapturePhotoSettings()
        output.capturePhoto(with: settings, delegate: self)
    }
    
    // MARK: - Retake Photo
    func retakePhoto() {
        previewImage = nil
    }
    
    // MARK: - Save Photo (Storage + Firestore)
    func savePhoto() {
        guard let image = previewImage else {
            print("No preview image to save.")
            return
        }
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            print("Failed to convert UIImage to JPEG.")
            return
        }
        
        // Build the filename, e.g. "random-uuid.jpg"
        let imageName = "\(UUID().uuidString).jpg"
        
        // 1) Upload to Firebase Storage
        let storageRef = storage.reference()
            .child("events/\(eventID)/\(imageName)")
        
        // Optional: add contentType & metadata
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
            
            // 2) Get the download URL
            storageRef.downloadURL { url, err in
                if let err = err {
                    print("Failed to get download URL: \(err.localizedDescription)")
                    return
                }
                guard let downloadURL = url else { return }
                
                // 3) Write a doc to Firestore: events/<eventID>/images/<autoID>
                let docRef = self.db
                    .collection("events")
                    .document(self.eventID)
                    .collection("images")
                    .document() // auto-gen an ID
                
                let photoDoc: [String: Any] = [
                    "url": downloadURL.absoluteString, // for displaying in the gallery
                    "owner": self.userName,            // so we can filter Personal vs. General
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
        
        // Reset the preview after saving
        previewImage = nil
    }
    
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
