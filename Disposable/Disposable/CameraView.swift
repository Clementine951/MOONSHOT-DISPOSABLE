//
//  CameraView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
//import AVFoundation
//import FirebaseStorage

struct CameraView: View {
    
    var eventID: String
    var userName: String
    
    @StateObject private var camera = CameraModel()
    
    var body: some View {
        ZStack{
            CameraPreview(camera: camera)
                .ignoresSafeArea()
            
            VStack{
                Spacer()
                
                // preview + save photo
                if let previewImage = camera.previewImage {
                    VStack{
                        Image(uiImage: previewImage)
                            .resizable()
                            .scaledToFit()
                            .frame(height: 300)
                            .padding()
                        
                        HStack{
                            Button(action: camera.retakePhoto){
                                Text("Re-take")
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.blue)
                                    .cornerRadius(10)
                            }
                            
                            Button(action: camera.savePhoto){
                                Text("Save photo")
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.green)
                                    .cornerRadius(10)
                            }
                        }
                        .padding(.bottom, 20)
                    }
                } else {
                    
                    VStack {
                        Spacer()

                        // Display remaining photos or "No more photos"
                        if camera.remainingPhotos > 0 {
                            Text("\(camera.remainingPhotos) remaining photos")
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.black.opacity(0.5))
                                .cornerRadius(10)
                        } else {
                            Text("No more photos")
                                .foregroundColor(.red)
                                .font(.headline)
                                .padding()
                                .background(Color.black.opacity(0.5))
                                .cornerRadius(10)
                        }

                        HStack(spacing: 20) {
                            // Flash toggle button
                            Button(action: { camera.toggleFlash() }) {
                                Image(systemName: camera.isFlashOn ? "bolt.fill" : "bolt.slash")
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.black.opacity(0.5))
                                    .clipShape(Circle())
                            }
                            
                            // Capture button - disabled when no more photos
                            Button(action: { camera.takePhoto() }) {
                                Circle()
                                    .fill(camera.remainingPhotos > 0 ? Color.blue : Color.gray)
                                    .frame(width: 70, height: 70)
                            }
                            .disabled(camera.remainingPhotos <= 0) // Disable button when no more photos
                            
                            // Switch camera button
                            Button(action: { camera.switchCamera() }) {
                                Image(systemName: "arrow.triangle.2.circlepath.camera")
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.black.opacity(0.5))
                                    .clipShape(Circle())
                            }
                        }
                        .padding(.bottom, 20)
                    }


                }
            }
        }
        .onAppear{
            camera.eventID = eventID
            camera.userName = userName
            camera.fetchRemainingPhotos()
            camera.checkPermissions()
        }
        .onDisappear{
            camera.stopSession()
        }
    }
}
