//
//  CameraPreview.swift
//  Disposable
//
//  Created by Clementine CUREL on 12/01/2025.
//
import SwiftUI
import AVFoundation

struct CameraPreview: UIViewRepresentable{
    @ObservedObject var camera: CameraModel
    
    func makeUIView(context: Context) -> some UIView {
        let view = UIView()
        camera.previewLayer = AVCaptureVideoPreviewLayer(session: camera.session)
        camera.previewLayer?.videoGravity = .resizeAspectFill
        camera.previewLayer?.frame = view.bounds
        
        if let previewLayer = camera.previewLayer{
            view.layer.addSublayer(previewLayer)
        }
        return view
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        camera.previewLayer?.frame = uiView.bounds
    }
}
