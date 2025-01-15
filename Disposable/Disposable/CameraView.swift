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
            CameraPreview()
                .edgesIgnoringSafeArea(.all)
            
            VStack{
                Spacer()
                Button(action: {
                    print("Capture photo tapped")
                }) {
                    Circle()
                        .fill(Color.blue)
                        .frame(width:70, height:70)
                }
                .padding(.bottom, 20)
            }
        }
    }
}
//
//// XCode Preview
//struct CameraView_Previews: PreviewProvider {
//    static var previews: some View {
//        NavigationView{
//            CameraView()
//        }
//    }
//}
