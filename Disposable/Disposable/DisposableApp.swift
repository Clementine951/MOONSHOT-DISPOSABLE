//
//  DisposableApp.swift
//  Disposable
//
//  Created by Clementine CUREL on 09/01/2025.
//

import SwiftUI

@main
struct DisposableApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    @State private var isInEvent = false
    @State private var eventData: [String: Any]? = nil

    var body: some Scene {
        WindowGroup {
            NavigationView {
                TabView {
                    HomeView(isInEvent: $isInEvent, eventData: $eventData)
                        .tabItem {
                            Image(systemName: "house")
                            Text("Home")
                        }
                    if isInEvent {
                        CameraView()
                            .tabItem {
                                Image(systemName: "camera")
                                Text("Camera")
                            }
                        GalleryView()
                            .tabItem {
                                Image(systemName: "photo.on.rectangle")
                                Text("Gallery")
                            }
                    }
                    SettingsView()
                        .tabItem {
                            Image(systemName: "gear")
                            Text("Settings")
                        }
                }
            }
        }
    }
}
