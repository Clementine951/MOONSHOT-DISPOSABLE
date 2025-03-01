//
//  SettingView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI

struct SettingsView: View {
    var body: some View {
        NavigationView {
            List {
                NavigationLink(destination: EventSettingsView()) {
                    Text("Event Settings")
                }
                
//                NavigationLink(destination: Text("Account Settings")) {
//                    Text("Account Settings")
//                }
//                
//                NavigationLink(destination: Text("App Settings")) {
//                    Text("App Settings")
//                }
//                
                NavigationLink(destination: DataSettingsView()) {
                    Text("Data Settings")
                }
            }
            .navigationTitle("Settings")
        }
    }
}

struct DataSettingsView: View {
    var body: some View {
        List {
            NavigationLink(destination: PrivacyPolicyView()) {
                Text("Privacy policy")
            }
            
            NavigationLink(destination: TermsAndConditionsView()) {
                Text("Terms and conditions")
            }
            
            NavigationLink(destination: ContactFormView()) {
                Text("Contact us")
            }
        }
        .navigationTitle("Data Settings")
    }
}

struct EventSettingsView: View {
    var body: some View {
        List {
            Text("Generate QR code")
            Text("Change duration")
            Text("Change number of photos")
            Text("Change release time")
            Text("Block a participant")
        }
        .navigationTitle("Event Settings")
    }
}
