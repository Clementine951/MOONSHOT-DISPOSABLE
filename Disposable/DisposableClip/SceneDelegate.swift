//
//  SceneDelegate.swift
//  Disposable
//
//  Created by Clementine CUREL on 23/02/2025.
//

import UIKit
import SwiftUI

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {

        var eventId: String? = nil

        if let appClipURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: appClipURL) {
            print("Simulated App Clip URL from Xcode: \(appClipURL)")

            // Extract eventId from the URL
            let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: true)
            eventId = urlComponents?.queryItems?.first(where: { $0.name == "eventId" })?.value
        }

        if let userActivity = connectionOptions.userActivities.first {
            print("🔄 Handling real deep link at launch")
            self.scene(scene, continue: userActivity)
        }

        if let windowScene = scene as? UIWindowScene {
            let window = UIWindow(windowScene: windowScene)
            let contentView = ContentView(eventId: eventId) // Pass the extracted eventId

            window.rootViewController = UIHostingController(rootView: contentView)
            self.window = window
            window.makeKeyAndVisible()
        }
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        print("scene(_:continue:) was called!")

        guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
              let incomingURL = userActivity.webpageURL else {
            print("No valid URL found in userActivity.")
            return
        }

        print("Incoming URL: \(incomingURL.absoluteString)")

        // Extract eventId from URL
        let urlComponents = URLComponents(url: incomingURL, resolvingAgainstBaseURL: true)
        let queryItems = urlComponents?.queryItems ?? []
        
        for item in queryItems {
            print("Query Parameter: \(item.name) = \(item.value ?? "nil")")
        }

        if let eventId = queryItems.first(where: { $0.name == "eventId" })?.value {
            print("Extracted Event ID: \(eventId)")

            DispatchQueue.main.async {
                if let window = self.window {
                    let contentView = ContentView(eventId: eventId)
                    window.rootViewController = UIHostingController(rootView: contentView)
                    window.makeKeyAndVisible()
                }
            }
        } else {
            print("No event ID found in the URL.")
        }
    }

}
