//
//  HomeView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI

extension Color {
    init(hex: String){
        var cleanHexCode = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        cleanHexCode = cleanHexCode.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        guard Scanner(string:cleanHexCode).scanHexInt64(&rgb) else {
            self = .clear
            return
        }
        
        Scanner(string: cleanHexCode).scanHexInt64(&rgb)
        
        let redValue = Double((rgb >> 16) & 0xFF) / 255.0
        let greenValue = Double((rgb >> 8) & 0xFF) / 255.0
        let blueValue = Double(rgb & 0xFF) / 255.0
        self.init(red:redValue, green:greenValue, blue:blueValue)
    }
}

struct HomeView: View {
    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            
            // logo
            VStack{
                Image("Logo")
                    .resizable()
                    .scaledToFit()
                    //.frame(width: 100, height: 100)
                    .padding(30)
            }
            
            Spacer()
            
            //Buttons
            VStack(spacing: 16){
                
                Button(action: {
                    print("Create an event tapped")
                }){
                    Text("Create an event")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "#E8D7FF"))
                        .foregroundColor(Color(hex: "#09745F"))
                        .fontWeight(.bold)
                        .cornerRadius(10)
                        .padding(.horizontal, 40)
                }
                
                Button(action: {
                    print("Join event tapped")
                }) {
                    Text("Join an event")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "#E8D7FF"))
                        .foregroundColor(Color(hex: "#09745F"))
                        .fontWeight(.bold)
                        .cornerRadius(10)
                        .padding(.horizontal, 40)
                }
            }
            
            Spacer()
        }
        .padding()
        .navigationBarTitle("Disposable")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// XCode Preview
struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView{
            HomeView()
        }
    }
}
