//
//  CameraPreview.swift
//  Disposable
//
//  Created by Clementine CUREL on 12/01/2025.
//

import SwiftUI
import AVFoundation

struct CameraPreview: UIViewRepresentable {
    @ObservedObject var camera: CameraModel

    func makeUIView(context: Context) -> UIView {
        let view = UIView()

        camera.previewLayer = AVCaptureVideoPreviewLayer(session: camera.session)
        camera.previewLayer?.videoGravity = .resizeAspectFill
        camera.previewLayer?.frame = .zero

        if let previewLayer = camera.previewLayer {
            view.layer.addSublayer(previewLayer)
        }

        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            if camera.previewLayer?.frame != uiView.bounds {
                camera.previewLayer?.frame = uiView.bounds
            }
        }
    }
}
