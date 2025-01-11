//
//  CameraView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI

struct CameraView: View {
    var body: some View {
        VStack{
            Spacer()
            
            Text("Camera Screen")
                .font(.largeTitle)
                .foregroundColor(.gray)
            
            Spacer()
            
            Button(action: {
                print("Capture photo tapped")
            }) {
                Circle()
                    .frame(width: 70, height: 70)
                    .foregroundColor(.blue)
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 5)
                    )
            }
            .padding()
        }
        .background(Color.black.edgesIgnoringSafeArea(.all))
    }
}
