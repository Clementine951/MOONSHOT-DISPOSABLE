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
    @State private var eventId: String? = nil
    
    init() {
        configureFirebaseForAppClip()
    }

    var body: some Scene {
        WindowGroup {
            ContentView(eventId: eventId)
                .onOpenURL { url in
                    handleIncomingURL(url)
                }
        }
    }

    private func configureFirebaseForAppClip() {
        if let filePath = Bundle.main.path(forResource: "GoogleService-Info-AppClip", ofType: "plist"),
           let options = FirebaseOptions(contentsOfFile: filePath) {
            FirebaseApp.configure(options: options)
            print("Firebase configured for App Clip")
        } else {
            print("Failed to load GoogleService-Info-AppClip.plist")
        }
    }

    private func handleIncomingURL(_ url: URL) {
        if let eventId = extractEventId(from: url) {
            print("Extracted Event ID: \(eventId)")
            self.eventId = eventId
        } else {
            print("No event ID found in URL")
        }
    }

    private func extractEventId(from url: URL) -> String? {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
        return components?.queryItems?.first(where: { $0.name == "eventId" })?.value
    }
}
