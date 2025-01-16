//
//  CameraView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
import AVFoundation
import FirebaseStorage

struct CameraView: View {
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
                    Button(action:camera.takePhoto){
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 70, height: 70)
                            .padding(.bottom, 20)
                    }
                }
            }
        }
        .onAppear{
            camera.checkPermissions()
        }
    }
}



//// XCode Preview
//struct CameraView_Previews: PreviewProvider {
//    static var previews: some View {
//        NavigationView{
//            CameraView()
//        }
//    }
//}
