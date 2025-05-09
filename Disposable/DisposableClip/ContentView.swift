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
import PhotosUI

struct ContentView: View {
    @State var eventId: String? = nil
    @State private var photos: [String] = []
    @State private var userName: String = ""
    @State private var eventName: String = ""
    @State private var isNameEntered: Bool = false
    @State private var hasAcceptedTerms: Bool = false
    @State private var showingImagePicker = false
    @State private var selectedImages: [UIImage] = []
    @State private var timer: Timer?
    @State private var isFullScreenMode: Bool = false // Track fullscreen mode
    @State private var selectedPhotoIndex: Int = 0 // Track the selected photo for fullscreen
    @State private var isEventNameLoaded: Bool = false
    @State private var showingCamera = false
    @State private var capturedImage: UIImage?
    
    @State private var showDownloadAlert = false
    
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
                        Button(action: { showDownloadAlert = true }) {
                            Label("Download", systemImage: "arrow.down.circle")
                        }
                        .padding()
                        .alert(isPresented: $showDownloadAlert) {
                            Alert(
                                title: Text("Download Photos"),
                                message: Text("Due to App Clip limitations, photos cannot be downloaded directly. Would you like to open the download page in your browser?"),
                                primaryButton: .default(Text("Open Browser")) {
                                    if let eventId = self.eventId, let url = URL(string: "https://disposableapp.xyz/html/template.html?eventId=\(eventId)") {
                                        UIApplication.shared.open(url)
                                    }
                                },
                                secondaryButton: .cancel()
                            )
                        }
                        
                        Button(action: { showingImagePicker = true }) {
                            Label("Upload", systemImage: "arrow.up.circle")
                        }
                        .padding()
                        .sheet(isPresented: $showingImagePicker) {
                            ImagePicker(images: $selectedImages)
                                .onDisappear {
                                    for image in selectedImages {
                                        uploadPhoto(image: image)
                                    }
                                    selectedImages.removeAll()
                                }
                        }
                        .sheet(isPresented: $showingCamera) {
                            CameraView(image: $capturedImage)
                                .onDisappear {
                                    if let image = capturedImage {
                                        uploadPhoto(image: image)
                                        capturedImage = nil
                                    }
                                }
                        }

                        Button(action: { showingCamera = true }) {
                            Label("Camera", systemImage: "camera")
                        }
                        .padding()
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
                    
                    // Fetch event name from the same request
                    if let nameField = fields["eventName"] as? [String: Any],
                       let fetchedEventName = nameField["stringValue"] as? String {
                        DispatchQueue.main.async {
                            print("Fetched Event Name: \(fetchedEventName)")
                            self.eventName = fetchedEventName
                        }
                    }
                    
                    // Fetch images from the same request
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

                    let sorted = documents.sorted { doc1, doc2 in
                        let ts1 = ((doc1["fields"] as? [String: Any])?["timestamp"] as? [String: Any])?["stringValue"] as? String ?? ""
                        let ts2 = ((doc2["fields"] as? [String: Any])?["timestamp"] as? [String: Any])?["stringValue"] as? String ?? ""
                        return ts1 < ts2 // fallback alphabetical sort
                    }

                    let urls = sorted.compactMap { document -> String? in
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
    
    
    //    func downloadAllPhotos() {
    //            for photoUrl in photos {
    //                guard let url = URL(string: photoUrl) else { continue }
    //
    //                let task = URLSession.shared.downloadTask(with: url) { (tempFileUrl, response, error) in
    //                    if let error = error {
    //                        print("Download error: \(error)")
    //                        return
    //                    }
    //
    //                    guard let tempFileUrl = tempFileUrl else { return }
    //
    //                    do {
    //                        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    //                        let destinationURL = documentsDirectory.appendingPathComponent(url.lastPathComponent)
    //
    //                        if FileManager.default.fileExists(atPath: destinationURL.path) {
    //                            try FileManager.default.removeItem(at: destinationURL)
    //                        }
    //
    //                        try FileManager.default.moveItem(at: tempFileUrl, to: destinationURL)
    //
    //                        print("Downloaded to: \(destinationURL.path)")
    //                    } catch {
    //                        print("Error moving file: \(error)")
    //                    }
    //                }
    //
    //                task.resume()
    //            }
    //        }
    
    
    func uploadPhoto(image: UIImage) {
        guard let eventId = eventId else {
            print("Event ID is not set.")
            return
        }
        
        if let imageData = image.jpegData(compressionQuality: 0.8) {
            let fileName = "\(userName)\(Date().timeIntervalSince1970).jpg"
            let storagePath = "events/\(eventId)/\(fileName)"
            let storageRef = Storage.storage().reference().child(storagePath)
            
            let metadata = StorageMetadata()
            metadata.contentType = "image/jpeg"
            
            storageRef.putData(imageData, metadata: metadata) { (_, error) in
                if let error = error {
                    print("Upload error: \(error)")
                    return
                }
                
                storageRef.downloadURL { (url, error) in
                    if let error = error {
                        print("Download URL error: \(error)")
                        return
                    }
                    
                    guard let downloadURL = url else { return }
                    
                    let firestoreURL = "https://firestore.googleapis.com/v1/projects/disposable-53b41/databases/(default)/documents/events/\(eventId)/images"
                    var request = URLRequest(url: URL(string: firestoreURL)!)
                    request.httpMethod = "POST"
                    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
                    
                    let body: [String: Any] = [
                        "fields": [
                            "url": ["stringValue": downloadURL.absoluteString],
                            "timestamp": ["stringValue": Date().iso8601],
                            "owner": ["stringValue": userName]
                        ]
                    ]
                    
                    do {
                        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
                    } catch {
                        print("JSON error: \(error)")
                        return
                    }
                    
                    URLSession.shared.dataTask(with: request).resume()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        if let eventId = self.eventId {
                            self.fetchImagesForEvent(eventId: eventId)
                        }
                    }
                }
            }
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
    @Binding var images: [UIImage]
    @Environment(\.presentationMode) private var presentationMode

    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.selectionLimit = 0 // 0 = unlimited
        config.filter = .images

        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.presentationMode.wrappedValue.dismiss()
            var pickedImages: [UIImage] = []
            let group = DispatchGroup()

            for result in results {
                if result.itemProvider.canLoadObject(ofClass: UIImage.self) {
                    group.enter()
                    result.itemProvider.loadObject(ofClass: UIImage.self) { object, _ in
                        if let image = object as? UIImage {
                            DispatchQueue.main.async {
                                pickedImages.append(image)
                            }
                        }
                        group.leave()
                    }
                }
            }

            group.notify(queue: .main) {
                self.parent.images = pickedImages
            }
        }
    }
}
