//
//  SceneDelegate.swift
//  DisposableClip
//
//  Created by Clémentine Curel on 26/08/2024.
//

import UIKit
import SwiftUI

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
              let incomingURL = userActivity.webpageURL else {
            print("No valid URL found.")
            return
        }

        print("Incoming URL: \(incomingURL.absoluteString)")

        // Parsing the URL to extract the eventId
        let urlComponents = URLComponents(url: incomingURL, resolvingAgainstBaseURL: true)
        let queryItems = urlComponents?.queryItems ?? []
        
        for item in queryItems {
            print("Query item: \(item.name) = \(item.value ?? "")")
        }

        if let eventId = queryItems.first(where: { $0.name == "eventId" })?.value {
            print("Event ID extracted: \(eventId)")
            if let rootViewController = window?.rootViewController as? UIHostingController<ContentView> {
                rootViewController.rootView.eventId = eventId
            }
        } else {
            print("No event ID found in the URL.")
        }
    }

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        if let windowScene = scene as? UIWindowScene {
            let window = UIWindow(windowScene: windowScene)
            let contentView = ContentView()

            window.rootViewController = UIHostingController(rootView: contentView)
            self.window = window
            window.makeKeyAndVisible()
        }
    }
}
