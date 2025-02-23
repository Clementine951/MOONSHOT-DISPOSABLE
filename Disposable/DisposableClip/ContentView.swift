//
//  ContentView.swift
//  DisposableClip
//
//  Created by Clementine CUREL on 09/01/2025.
//

import Foundation
import SwiftUI
import UIKit
import FirebaseStorage
import SDWebImageSwiftUI
import Photos


struct ContentView: View {
    @State var eventId: String? = nil
    @State private var photos: [String] = []
    @State private var userName: String = ""
    @State private var eventName: String = ""
    @State private var isNameEntered: Bool = false
    @State private var hasAcceptedTerms: Bool = false
    @State private var showingImagePicker = false
    @State private var inputImage: UIImage?
    @State private var timer: Timer?
    @State private var isFullScreenMode: Bool = false // Track fullscreen mode
    @State private var selectedPhotoIndex: Int = 0 // Track the selected photo for fullscreen
    @State private var isEventNameLoaded: Bool = false


    var body: some View {
        if isNameEntered {
            NavigationView {
                VStack {
                    Text("\(photos.count) Photos")
                        .font(.headline)

                    ScrollView(.vertical) {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                            ForEach(Array(photos.enumerated()), id: \.element) { index, photoUrl in
                                WebImage(url: URL(string: photoUrl))
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .frame(width: 100, height: 100)
                                    .cornerRadius(8)
                                    .onTapGesture {
                                        selectedPhotoIndex = index
                                        isFullScreenMode.toggle()
                                    }
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
                .navigationTitle(eventName.isEmpty ? "Event" : eventName)
                .onAppear {
                    startReloadingImages()
                    if let eventId = self.eventId {
                        fetchImagesForEvent(eventId: eventId)
                        addUserToEvent(eventId: eventId, userName: userName)
                    }
                }
                .onDisappear {
                    stopReloadingImages()
                }
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: handleUserActivity)
            }
            .fullScreenCover(isPresented: $isFullScreenMode) {
                FullScreenPhotoView(photos: photos, selectedPhotoIndex: $selectedPhotoIndex)
            }
        } else {
            VStack {
                Image("Logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 150, height: 150)
                Text("Enter your name to join the event:")
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

    // Fetch Images for Event from Firestore REST API
    func fetchImagesForEvent(eventId: String) {
        let firestoreURL = "https://firestore.googleapis.com/v1/projects/disposable-53b41/databases/(default)/documents/events/\(eventId)"

        guard let url = URL(string: firestoreURL) else { return }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching event data: \(error)")
                return
            }

            guard let data = data else { return }
            do {
                if let jsonResponse = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let fields = jsonResponse["fields"] as? [String: Any] {

                    // ✅ Fetch event name from the same request
                    if let nameField = fields["eventName"] as? [String: Any],
                       let fetchedEventName = nameField["stringValue"] as? String {
                        DispatchQueue.main.async {
                            print("Fetched Event Name: \(fetchedEventName)")
                            self.eventName = fetchedEventName
                        }
                    }

                    // ✅ Fetch images from the same request
                    let imagesCollectionURL = "\(firestoreURL)/images"
                    fetchEventImages(from: imagesCollectionURL)
                }
            } catch {
                print("Error parsing JSON: \(error)")
            }
        }

        task.resume()
    }
    
    func fetchEventImages(from url: String) {
        guard let imagesURL = URL(string: url) else { return }

        let task = URLSession.shared.dataTask(with: imagesURL) { data, response, error in
            if let error = error {
                print("Error fetching images: \(error)")
                return
            }

            guard let data = data else { return }
            do {
                if let jsonResponse = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let documents = jsonResponse["documents"] as? [[String: Any]] {
                    
                    let urls = documents.compactMap { document -> String? in
                        guard let fields = document["fields"] as? [String: Any],
                              let urlField = fields["url"] as? [String: Any],
                              let urlString = urlField["stringValue"] as? String else {
                            return nil
                        }
                        return urlString
                    }

                    DispatchQueue.main.async {
                        self.photos = urls
                    }
                }
            } catch {
                print("Error parsing images JSON: \(error)")
            }
        }

        task.resume()
    }

    
    func fetchEventName(eventId: String) {
        let firestoreURL = "https://firestore.googleapis.com/v1/projects/disposable-53b41/databases/(default)/documents/events/\(eventId)"

        guard let url = URL(string: firestoreURL) else { return }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching event name: \(error)")
                DispatchQueue.main.async {
                    self.isEventNameLoaded = true
                }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async {
                    self.isEventNameLoaded = true
                }
                return
            }

            do {
                if let jsonResponse = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let fields = jsonResponse["fields"] as? [String: Any],
                   let nameField = fields["eventName"] as? [String: Any],
                   let fetchedEventName = nameField["stringValue"] as? String {

                    DispatchQueue.main.async {
                        print("Fetched Event Name: \(fetchedEventName)") // Debugging log
                        self.eventName = fetchedEventName
                        self.isEventNameLoaded = true
                    }
                } else {
                    DispatchQueue.main.async {
                        print("Invalid Firestore response format")
                        self.isEventNameLoaded = true
                    }
                }
            } catch {
                print("Error parsing JSON: \(error)")
                DispatchQueue.main.async {
                    self.isEventNameLoaded = true
                }
            }
        }

        task.resume()
    }




    // Add User to Event using Firestore REST API
    func addUserToEvent(eventId: String, userName: String) {
        let userDefaultsKey = "com.disposableclip.userId"
        let deviceId: String

        // Check if a unique user ID exists in UserDefaults
        if let savedUserId = UserDefaults.standard.string(forKey: userDefaultsKey), savedUserId != "00000000-0000-0000-0000-000000000000" {
            deviceId = savedUserId
        } else {
            // Generate a new UUID for App Clip users
            deviceId = UUID().uuidString
            UserDefaults.standard.set(deviceId, forKey: userDefaultsKey)
            print("Generated new userId: \(deviceId)")
        }

        let firestoreURL = "https://firestore.googleapis.com/v1/projects/disposable-53b41/databases/(default)/documents/events/\(eventId)/participants"

        let participantData: [String: Any] = [
            "fields": [
                "userId": ["stringValue": deviceId],
                "role": ["stringValue": "participant"],
                "name": ["stringValue": userName]
            ]
        ]

        guard let url = URL(string: firestoreURL) else {
            print("Invalid Firestore URL")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: participantData, options: [])
            request.httpBody = jsonData
        } catch {
            print("Error serializing participant data: \(error)")
            return
        }

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error adding user to event: \(error)")
                return
            }

            if let httpResponse = response as? HTTPURLResponse {
                if httpResponse.statusCode == 200 {
                    print("User successfully added to event!")
                } else {
                    print("Firestore returned status code: \(httpResponse.statusCode)")
                    if let responseData = data {
                        print("Response: \(String(data: responseData, encoding: .utf8) ?? "Unknown error")")
                    }
                }
            }
        }

        task.resume()
    }



    // Download All Photos
    func downloadAllPhotos() {
        for photoUrl in photos {
            guard let url = URL(string: photoUrl) else { continue }

            URLSession.shared.dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌ Download error: \(error)")
                    return
                }

                guard let data = data, let image = UIImage(data: data) else {
                    print("❌ Failed to convert data to UIImage.")
                    return
                }

                // ✅ Use completion handler to check if the image was saved
                DispatchQueue.main.async {
                    UIImageWriteToSavedPhotosAlbum(image, nil, #selector(self.imageSaveCompleted(_:didFinishSavingWithError:contextInfo:)), nil)
                }
            }.resume()
        }
    }

    // ✅ Completion handler to check if saving was successful
    @objc func imageSaveCompleted(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
        if let error = error {
            print("❌ Error saving to Photos Library: \(error.localizedDescription)")
        } else {
            print("✅ Image successfully saved to Photos Library!")
        }
    }





    // Upload Photo to Firebase Storage and Save Image URL to Firestore via REST API
    func uploadPhoto() {
        guard let eventId = eventId else {
            print("Event ID is not set.")
            return
        }

        if let inputImage = inputImage, let imageData = inputImage.jpegData(compressionQuality: 0.8) {
            let fileName = "\(userName)\(Date().timeIntervalSince1970).jpg"
            let storagePath = "events/\(eventId)/\(fileName)"

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

                    let firestoreURL = "https://firestore.googleapis.com/v1/projects/disposable-53b41/databases/(default)/documents/events/\(eventId)/images"
                    guard let url = URL(string: firestoreURL) else { return }

                    var request = URLRequest(url: url)
                    request.httpMethod = "POST"
                    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

                    let imageData: [String: Any] = [
                        "fields": [
                            "url": ["stringValue": downloadURL.absoluteString],
                            "timestamp": ["timestampValue": Date().iso8601],
                            "owner": ["stringValue": userName]
                        ]
                    ]

                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: imageData, options: [])
                        request.httpBody = jsonData
                    } catch {
                        print("Error serializing image data: \(error)")
                        return
                    }

                    let task = URLSession.shared.dataTask(with: request) { data, response, error in
                        if let error = error {
                            print("Error sending data to Firestore: \(error)")
                            return
                        }

                        if let responseData = data {
                            print("Firestore response: \(String(data: responseData, encoding: .utf8) ?? "")")
                            self.photos.append(downloadURL.absoluteString)
                        }
                    }

                    task.resume()
                }
            }
        } else {
            print("No image selected.")
        }
    }

}

// Full-Screen View for Swiping through Photos
struct FullScreenPhotoView: View {
    var photos: [String]
    @Binding var selectedPhotoIndex: Int
    @Environment(\.presentationMode) var presentationMode // To dismiss the full-screen view

    var body: some View {
        VStack {
            HStack {
                // Add a close (X) button in the top-left corner to dismiss the view
                Button(action: {
                    presentationMode.wrappedValue.dismiss() // Exit full screen
                }) {
                    Image(systemName: "xmark") // SF Symbol for "X"
                        .font(.title)
                        .padding()
                        .foregroundColor(.white)
                        .background(Color.black.opacity(0.5))
                        .clipShape(Circle())
                }
                Spacer()
            }
            .padding(.top, 40)

            TabView(selection: $selectedPhotoIndex) {
                ForEach(0..<photos.count, id: \.self) { index in
                    WebImage(url: URL(string: photos[index]))
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .tag(index)
                }
            }
            .tabViewStyle(PageTabViewStyle())
            .edgesIgnoringSafeArea(.all) // Make sure the image covers the entire screen
        }
        .gesture(DragGesture().onEnded { gesture in
            // Swipe down or up to dismiss the full-screen mode
            if gesture.translation.height > 100 || gesture.translation.height < -100 {
                presentationMode.wrappedValue.dismiss() // Exit full screen
            }
        })
    }
}


// Helper extension to format Date in ISO8601 for Firestore
extension Date {
    var iso8601: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
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
