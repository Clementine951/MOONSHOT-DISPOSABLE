//
//  DisposableClipApp.swift
//  DisposableClip
//
//  Created by Clémentine Curel on 20/08/2024.
//

import SwiftUI
import Firebase
import FirebaseFirestore

@main
struct DisposableClipApp: App {
    // Register AppDelegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// Custom AppDelegate to configure Firebase
class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
