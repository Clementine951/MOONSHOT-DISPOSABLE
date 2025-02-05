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

                        // Buttons in a row
                        HStack(spacing: 20) {
                            // Flash toggle button
                            Button(action: { camera.toggleFlash() }) {
                                Image(systemName: camera.isFlashOn ? "bolt.fill" : "bolt.slash")
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.black.opacity(0.5))
                                    .clipShape(Circle())
                            }

                            // Capture button
                            Button(action: { camera.takePhoto() }) {
                                Circle()
                                    .fill(Color.blue)
                                    .frame(width: 70, height: 70)
                            }

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
            
            camera.checkPermissions()
        }
        .onDisappear{
            camera.stopSession()
        }
    }
}



//struct CameraView_Previews: PreviewProvider {
//    static var previews: some View {
//        CameraView(eventID: "demoEvent", ownerName: "DemoUser")
//    }
//}
