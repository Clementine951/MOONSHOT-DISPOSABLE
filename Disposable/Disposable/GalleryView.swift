//
//  GalleryView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI

struct GalleryView: View {
    @State private var selectedTab = 0
    
    var body: some View{
        VStack{
            Picker("Gallery Type", selection: $selectedTab){
                Text("Personal").tag(0)
                Text("General").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            if selectedTab == 0{
                Text("Personal photos")
            }else{
                Text("General photos")
            }
        }
        .padding()
    }
}

// XCode Preview
struct GalleryView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView{
            GalleryView()
        }
    }
}
