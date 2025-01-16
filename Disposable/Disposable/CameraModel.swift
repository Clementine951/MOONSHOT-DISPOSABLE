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
    
    private var captureSessionQueue = DispatchQueue(label: "CaptureSessionQueue")
    private var storage = Storage.storage()
    
    override init() {
        super.init()
        setupCamera()
    }
    
    func setupCamera() {
        captureSessionQueue.async {
            self.session.beginConfiguration()
            
            guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
                  let videoInput = try? AVCaptureDeviceInput(device: videoDevice) else {return}
            
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
                }
            }
        default:
            print("No camera permissions granted")
        }
    }
    
    func startSession(){
        captureSessionQueue.async {
            self.session.startRunning()
        }
    }
    
    func stopSession(){
        captureSessionQueue.async{
            self.session.stopRunning()
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
        guard let image = previewImage else {return}
        
        guard let data = image.jpegData(compressionQuality: 0.8) else {return}
        
        let storageRef = storage.reference().child("images/\(UUID().uuidString).jpg")
        storageRef.putData(data, metadata: nil){ _, error in
            if let error = error {
                print("Error uploading image: \(error.localizedDescription)")
            }else {
                print("Image uploaded")
            }
        }
        
        previewImage = nil
    }
}

extension CameraModel: AVCapturePhotoCaptureDelegate{
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?){
        guard let data = photo.fileDataRepresentation(),
              let image = UIImage(data: data) else {return}
        
        DispatchQueue.main.async{
            self.previewImage = image
        }
    }
}
