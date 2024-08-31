//
//  ContentView.swift
//  DisposableClip
//
//  Created by Clémentine Curel on 20/08/2024.
//

import Foundation
import SwiftUI
import UIKit
import FirebaseFirestore
import FirebaseStorage
import SDWebImageSwiftUI

struct ContentView: View {
    @State var eventId: String? = nil
    @State private var photos: [String] = []
    @State private var userName: String = ""
    @State private var isNameEntered: Bool = false
    @State private var hasAcceptedTerms: Bool = false
    @State private var showingImagePicker = false
    @State private var inputImage: UIImage?
    @State private var timer: Timer?

    var body: some View {
        if isNameEntered {
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

                        Button(action: { showingImagePicker = true }) {
                            Label("Upload", systemImage: "arrow.up.circle")
                        }
                        .padding()
                        .sheet(isPresented: $showingImagePicker) {
                            ImagePicker(image: $inputImage)
                                .onDisappear(perform: uploadPhoto)
                        }
                    }
                }
                .navigationTitle("Gallery")
                .onAppear {
                    startReloadingImages() // Start automatic reloading when the view appears
                    if let eventId = self.eventId {
                        fetchImagesForEvent(eventId: eventId)
                        addUserToEvent(eventId: eventId, userName: userName)
                    }
                }
                .onDisappear {
                    stopReloadingImages() // Stop the timer when the view disappears
                }
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: handleUserActivity)
            }
        } else {
            VStack {
                Text("Enter your name to proceed:")
                    .font(.headline)
                    .padding()

                TextField("Your Name", text: $userName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                Toggle(isOn: $hasAcceptedTerms) {
                    VStack(alignment: .leading) {
                        HStack {
                            Text("I accept the ")
                            Text("Terms & Conditions")
                                .underline()
                                .foregroundColor(.blue)
                                .onTapGesture {
                                    if let url = URL(string: "https://www.disposableapp.xyz/terms-co") {
                                        UIApplication.shared.open(url)
                                    }
                                }
                            Text(" and ")
                            Text("Privacy Policy")
                                .underline()
                                .foregroundColor(.blue)
                                .onTapGesture {
                                    if let url = URL(string: "https://www.disposableapp.xyz/privacy") {
                                        UIApplication.shared.open(url)
                                    }
                                }
                        }
                    }
                }
                .padding()

                Button("Continue") {
                    if !userName.isEmpty && hasAcceptedTerms {
                        isNameEntered = true
                        if let eventId = self.eventId {
                            fetchImagesForEvent(eventId: eventId)
                            addUserToEvent(eventId: eventId, userName: userName)
                        }
                    }
                }
                .padding()
                .disabled(!hasAcceptedTerms || userName.isEmpty)
            }
            .padding()
        }
    }

    func startReloadingImages() {
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { _ in
            if let eventId = self.eventId {
                fetchImagesForEvent(eventId: eventId)
            }
        }
    }

    func stopReloadingImages() {
        timer?.invalidate()
        timer = nil
    }

    func handleUserActivity(_ userActivity: NSUserActivity) {
        if let incomingURL = userActivity.webpageURL {
            let eventId = extractEventId(from: incomingURL)
            print("Received eventId from URL: \(eventId ?? "nil")")
            self.eventId = eventId
            if let eventId = eventId {
                fetchImagesForEvent(eventId: eventId)
                addUserToEvent(eventId: eventId, userName: userName)
            }
        }
    }

    func extractEventId(from url: URL) -> String? {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let eventId = components?.queryItems?.first(where: { $0.name == "eventId" })?.value
        return eventId
    }

    func fetchImagesForEvent(eventId: String) {
        let db = Firestore.firestore()

        db.collection("events").document(eventId).collection("images").getDocuments { (snapshot, error) in
            if let error = error {
                print("Error fetching images: \(error)")
                return
            }

            guard let documents = snapshot?.documents else { return }

            self.photos = documents.compactMap { $0.data()["url"] as? String }
        }
    }

    func addUserToEvent(eventId: String, userName: String) {
        let db = Firestore.firestore()

        // Key for storing user ID in UserDefaults
        let userDefaultsKey = "com.disposableclip.userId"

        let deviceId: String
        if let savedUserId = UserDefaults.standard.string(forKey: userDefaultsKey) {
            // Use the saved user ID if it exists
            deviceId = savedUserId
            print("Using saved user ID: \(deviceId)")
        } else if let identifierForVendor = UIDevice.current.identifierForVendor?.uuidString, identifierForVendor != "00000000-0000-0000-0000-000000000000" {
            // Use identifierForVendor if it's valid
            deviceId = identifierForVendor
            print("Using identifierForVendor: \(deviceId)")
            UserDefaults.standard.set(deviceId, forKey: userDefaultsKey) // Save it for future use
        } else {
            // Generate a new UUID and save it
            deviceId = UUID().uuidString
            print("Generated new UUID: \(deviceId)")
            UserDefaults.standard.set(deviceId, forKey: userDefaultsKey)
        }

        print("Attempting to add user to event with ID: \(eventId)")

        db.collection("events").document(eventId).collection("participants").document(deviceId).setData([
            "userId": deviceId,
            "role": "participant",
            "name": userName
        ]) { error in
            if let error = error {
                print("Error adding user to event: \(error)")
            } else {
                print("User successfully added to event")
            }
        }
    }

    func downloadAllPhotos() {
        for photoUrl in photos {
            guard let url = URL(string: photoUrl) else { continue }

            let task = URLSession.shared.downloadTask(with: url) { (tempFileUrl, response, error) in
                if let error = error {
                    print("Download error: \(error)")
                    return
                }

                guard let tempFileUrl = tempFileUrl else { return }

                do {
                    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                    let destinationURL = documentsDirectory.appendingPathComponent(url.lastPathComponent)

                    if FileManager.default.fileExists(atPath: destinationURL.path) {
                        try FileManager.default.removeItem(at: destinationURL)
                    }

                    try FileManager.default.moveItem(at: tempFileUrl, to: destinationURL)

                    print("Downloaded to: \(destinationURL.path)")
                } catch {
                    print("Error moving file: \(error)")
                }
            }

            task.resume()
        }
    }

    func uploadPhoto() {
        guard let eventId = eventId else {
            print("Event ID is not set.")
            return
        }

        if let inputImage = inputImage, let imageData = inputImage.jpegData(compressionQuality: 0.8) {
            let fileName = "\(userName)\(Date().timeIntervalSince1970).jpg"
            let storagePath = "\(eventId)/\(fileName)"

            let storageRef = Storage.storage().reference().child(storagePath)

            let metadata = StorageMetadata()
            metadata.contentType = "image/jpeg"

            storageRef.putData(imageData, metadata: metadata) { (metadata, error) in
                if let error = error {
                    print("Upload error: \(error)")
                    return
                }

                storageRef.downloadURL { (url, error) in
                    if let error = error {
                        print("Error getting download URL: \(error)")
                        return
                    }

                    guard let downloadURL = url else { return }

                    let db = Firestore.firestore()
                    db.collection("events").document(eventId).collection("images").addDocument(data: [
                        "url": downloadURL.absoluteString,
                        "timestamp": Date().timeIntervalSince1970,
                        "owner": userName
                    ]) { error in
                        if let error = error {
                            print("Error saving image URL to Firestore: \(error)")
                        } else {
                            self.photos.append(downloadURL.absoluteString)
                            print("Image URL saved to Firestore: \(downloadURL.absoluteString)")
                        }
                    }
                }
            }
        } else {
            print("No image selected.")
        }
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.presentationMode) private var presentationMode

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = .photoLibrary
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            parent.presentationMode.wrappedValue.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}
