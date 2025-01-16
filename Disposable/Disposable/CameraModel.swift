//
//  CameraModel.swift
//  Disposable
//
//  Created by Clementine CUREL on 15/01/2025.
//

import AVFoundation
import UIKit
import FirebaseStorage

class CameraModel: NSObject, ObservableObject{
    @Published var session = AVCaptureSession()
    @Published var previewLayer: AVCaptureVideoPreviewLayer?
    @Published var output = AVCapturePhotoOutput()
    @Published var previewImage: UIImage?
    
    @Published var eventID: String = "unknownEvent"
    @Published var ownerName: String = "unknownOwner"
    
    private var captureSessionQueue = DispatchQueue(label: "CaptureSessionQueue")
    private var storage = Storage.storage()
    
    override init() {
        super.init()
        setupCamera()
    }
    
    func setupCamera() {
        captureSessionQueue.async {
            self.session.beginConfiguration()
            
            guard let videoDevice = AVCaptureDevice.default(
                .builtInWideAngleCamera,
                for: .video,
                position: .back
            ),
            let videoInput = try? AVCaptureDeviceInput(device: videoDevice) else {
                print("failes to access back cam")
                return
            }
            
            if self.session.canAddInput(videoInput){
                self.session.addInput(videoInput)
            }
            
            if self.session.canAddOutput(self.output) {
                self.session.addOutput(self.output)
            }
            
            self.session.commitConfiguration()
        }
    }
    
    func checkPermissions(){
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            startSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video){
                granted in
                if granted{
                    self.startSession()
                }else{
                    print("camera access denied by user")
                }
            }
        default:
            print("No camera permissions granted/restricted")
        }
    }
    
    func startSession(){
        captureSessionQueue.async {
            self.session.startRunning()
            print("camera session started")
        }
    }
    
    func stopSession(){
        captureSessionQueue.async{
            self.session.stopRunning()
            print("camera session stopped")
        }
    }
    
    func takePhoto(){
        let settings = AVCapturePhotoSettings()
        output.capturePhoto(with: settings, delegate: self)
    }
    
    func retakePhoto(){
        previewImage = nil
    }
    
    func savePhoto(){
        guard let image = previewImage else {
            print("no preview image to save")
            return
        }
        
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            print("failed to convert UIImage to jpeg data")
            return
        }
        

        let imageName = "\(UUID().uuidString).jpg"
        let storageRef = Storage.storage()
            .reference()
            .child("events/\(eventID)/\(imageName)")
        
        // metadata
        let metadata = StorageMetadata()
        metadata.contentType = "image/jpeg"
        metadata.customMetadata = [
            "time": ISO8601DateFormatter().string(from: Date()),
            "eventId": eventID,
            "owner": ownerName
        ]
        
        // upload data specified path
        storageRef.putData(data, metadata: metadata){ _, error in
            if let error = error {
                print("Error uploading image: \(error.localizedDescription)")
            }else {
                print("Image uploaded/\(self.eventID)/\(imageName)")
            }
        }
        
        previewImage = nil
    }
}

extension CameraModel: AVCapturePhotoCaptureDelegate{
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?){
        
        if let error = error {
            print("error capturing photo: \(error.localizedDescription)")
            return
        }
        
        guard let data = photo.fileDataRepresentation(),
              let image = UIImage(data: data) else {
            print("failed to convert photo to uiimage")
            return
        }
        
        DispatchQueue.main.async{
            self.previewImage = image
            print("phpoto captures and set to previewImage")
        }
    }
}
