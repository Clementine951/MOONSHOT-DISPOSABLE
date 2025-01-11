//
//  DisposableClipApp.swift
//  DisposableClip
//
//  Created by Clementine CUREL on 09/01/2025.
//

import SwiftUI
import FirebaseCore

@main
struct DisposableClipApp: App {
    init() {
        configureFirebaseForAppClip()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }

    private func configureFirebaseForAppClip() {
        // Dynamically load the App Clip's GoogleService-Info plist
        if let filePath = Bundle.main.path(forResource: "GoogleService-Info-AppClip", ofType: "plist"),
           let options = FirebaseOptions(contentsOfFile: filePath) {
            FirebaseApp.configure(options: options)
            print("Firebase configured for App Clip")
        } else {
            print("Failed to load GoogleService-Info-AppClip.plist")
        }
    }
}
