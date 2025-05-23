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

    @State private var isInEvent = UserDefaults.standard.bool(forKey: "isInEvent")
    @State private var eventData: [String: Any]? = {
        if let savedData = UserDefaults.standard.data(forKey: "currentEventData"),
            let decodedData = try? JSONSerialization.jsonObject(with: savedData, options: []) as? [String: Any] {
            return decodedData
        }
        return nil
    }()
    
    @State private var deepLinkedEventId: String? = nil

    var body: some Scene {
        WindowGroup {
            NavigationView {
                TabView {
                    HomeView(isInEvent: $isInEvent, eventData: $eventData, deepLinkedEventId: $deepLinkedEventId)
                        .tabItem {
                            Image(systemName: "house")
                            Text("Home")
                        }
                    if isInEvent {
                        let eventID = eventData?["eventId"] as? String ?? "noEvent"
                        let user = eventData?["userName"] as? String ?? "anonymous"
                        CameraView(eventID: eventID, userName: user)
                            .tabItem {
                                Image(systemName: "camera")
                                Text("Camera")
                            }
                        GalleryView(eventID: eventID, userName: user)
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
            .onOpenURL { url in
                if let eventId = extractEventId(from: url), !isInEvent {
                    print("Extracted eventId from URL: \(eventId)")
                    deepLinkedEventId = eventId
                } else {
                    print("Ignored QR because already in an event")
                }
            }
        }
    }
    private func extractEventId(from url: URL) -> String? {
            let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
            return components?.queryItems?.first(where: { $0.name == "eventId" })?.value
        }
}
