//
//  AppDelegate.swift
//  Disposable
//
//  Created by Clementine CUREL on 09/01/2025.
//


import SwiftUI
import FirebaseCore

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
    ) -> Bool {
        configureFirebase()
        return true
    }
}

// Function to dynamically configure Firebase
func configureFirebase() {
    #if APPCLIP
    // For App Clip
    if let filePath = Bundle.main.path(forResource: "GoogleService-Info-AppClip", ofType: "plist"),
       let options = FirebaseOptions(contentsOfFile: filePath) {
        FirebaseApp.configure(options: options)
        print("Firebase configured for App Clip")
    } else {
        print("Failed to load App Clip Firebase configuration")
    }
    #else
    // For Main App
    if let filePath = Bundle.main.path(forResource: "GoogleService-Info-Main", ofType: "plist"),
       let options = FirebaseOptions(contentsOfFile: filePath) {
        FirebaseApp.configure(options: options)
        print("Firebase configured for Main App")
    } else {
        print("Failed to load Main App Firebase configuration")
    }
    #endif
}

