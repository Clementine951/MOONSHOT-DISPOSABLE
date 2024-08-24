//
//  ContentView.swift
//  DisposableClip
//
//  Created by Clémentine Curel on 20/08/2024.
//

import SwiftUI
import FirebaseFirestore
import SDWebImageSwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    @State private var photos: [String] = [] // Updated to store URLs as Strings
    @State private var eventId: String?

    var body: some View {
        TabView(selection: $selectedTab) {
            GalleryView(photos: $photos)
                .tabItem {
                    Image(systemName: "photo")
                    Text("Gallery")
                }
                .tag(0)

            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
                .tag(1)
        }
        .onAppear {
            // Extract event ID from the invocation URL
            if let url = URL(string: "https://disposableapp.xyz/clip?eventId=Ross_1724483501555") { // Replace with actual URL
                if let eventId = url.queryItems?["eventId"] {
                    self.eventId = eventId
                    fetchImagesForEvent(eventId: eventId)
                }
            }
        }
    }

    func fetchImagesForEvent(eventId: String) {
        let db = Firestore.firestore()
        
        db.collection("events").document(eventId).collection("images").getDocuments { (snapshot, error) in
            if let error = error {
                print("Error fetching images: \(error)")
                return
            }
            
            guard let documents = snapshot?.documents else { return }
            
            for document in documents {
                let data = document.data()
                if let imageUrl = data["url"] as? String {
                    self.photos.append(imageUrl)
                }
            }
        }
    }
}

extension URL {
    var queryItems: [String: String]? {
        var params = [String: String]()
        if let components = URLComponents(url: self, resolvingAgainstBaseURL: false) {
            if let queryItems = components.queryItems {
                for item in queryItems {
                    params[item.name] = item.value
                }
            }
        }
        return params
    }
}

struct GalleryView: View {
    @Binding var photos: [String]

    var body: some View {
        NavigationView {
            VStack {
                Text("\(photos.count) Photos")
                    .font(.headline)

                ScrollView(.vertical) {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        ForEach(photos, id: \.self) { photoUrl in
                            WebImage(url: URL(string: photoUrl))
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 100, height: 100)
                                .cornerRadius(8)
                        }
                    }
                }

                HStack {
                    Button(action: downloadAllPhotos) {
                        Label("Download", systemImage: "arrow.down.circle")
                    }
                    .padding()

                    Button(action: uploadPhoto) {
                        Label("Upload", systemImage: "arrow.up.circle")
                    }
                    .padding()
                }
            }
            .navigationTitle("Gallery")
        }
    }

    func downloadAllPhotos() {
        // Implement download logic
    }

    func uploadPhoto() {
        // Implement upload logic
    }
}

struct SettingsView: View {
    var body: some View {
        Text("Settings")
            .font(.headline)
    }
}
