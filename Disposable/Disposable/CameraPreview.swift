//
//  CameraPreview.swift
//  Disposable
//
//  Created by Clementine CUREL on 12/01/2025.
//
import SwiftUI
import AVFoundation

struct CameraPreview: UIViewControllerRepresentable {
    class CameraViewController: UIViewController {
        var captureSession: AVCaptureSession?
        var previewLayer: AVCaptureVideoPreviewLayer?

        override func viewDidLoad() {
            super.viewDidLoad()
            setupCamera()
        }

        private func setupCamera() {
            let session = AVCaptureSession()
            session.beginConfiguration()

            // Add camera input
            guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else {
                print("Failed to access the camera.")
                return
            }

            guard let videoInput = try? AVCaptureDeviceInput(device: videoCaptureDevice) else {
                print("Failed to create camera input.")
                return
            }

            if session.canAddInput(videoInput) {
                session.addInput(videoInput)
            } else {
                print("Failed to add camera input to the session.")
                return
            }

            session.commitConfiguration()

            // Add preview layer
            previewLayer = AVCaptureVideoPreviewLayer(session: session)
            previewLayer?.videoGravity = .resizeAspectFill
            previewLayer?.frame = view.bounds
            if let previewLayer = previewLayer {
                view.layer.addSublayer(previewLayer)
            }

            session.startRunning()
            captureSession = session
        }

        override func viewDidLayoutSubviews() {
            super.viewDidLayoutSubviews()
            previewLayer?.frame = view.bounds
        }
    }

    func makeUIViewController(context: Context) -> CameraViewController {
        return CameraViewController()
    }

    func updateUIViewController(_ uiViewController: CameraViewController, context: Context) {
        // Update the view controller if needed
    }
}
