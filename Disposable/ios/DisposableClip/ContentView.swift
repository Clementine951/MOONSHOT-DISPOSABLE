//
//  ContentView.swift
//  DisposableClip
//
//  Created by Clémentine Curel on 20/08/2024.
//

import SwiftUI
import FirebaseFirestore
import FirebaseStorage
import SDWebImageSwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    @State private var photos: [String] = [] // Store URLs as Strings
    @State private var eventId: String?
    @State private var userName: String = ""
    @State private var isNameEntered: Bool = false

    var body: some View {
        if isNameEntered {
            TabView(selection: $selectedTab) {
                GalleryView(photos: $photos, eventId: $eventId, userName: $userName)
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
                // Extract event ID from the App Clip invocation URL
                if let url = URL(string: "https://disposableapp.xyz/clip?eventId=Ross_1724483501555") { // Replace with actual URL
                    if let eventId = url.queryItems?["eventId"] {
                        self.eventId = eventId
                        fetchImagesForEvent(eventId: eventId)
                        addUserToEvent(eventId: eventId, userName: userName)
                    }
                }
            }
        } else {
            VStack {
                Text("Enter your name to proceed:")
                    .font(.headline)
                    .padding()

                TextField("Your Name", text: $userName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                Button("Continue") {
                    if !userName.isEmpty {
                        isNameEntered = true
                    }
                }
                .padding()
            }
            .padding()
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

    func addUserToEvent(eventId: String, userName: String) {
        let db = Firestore.firestore()
        
        // Generate a reliable unique device ID
        let deviceId: String
        if let identifierForVendor = UIDevice.current.identifierForVendor?.uuidString, identifierForVendor != "00000000-0000-0000-0000-000000000000" {
            deviceId = identifierForVendor
        } else {
            deviceId = UUID().uuidString // Fallback to a randomly generated UUID
        }

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
    @Binding var eventId: String?
    @Binding var userName: String
    @State private var showingImagePicker = false
    @State private var inputImage: UIImage?

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
            let fileName = UUID().uuidString + ".jpg"
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
                        "timestamp": FieldValue.serverTimestamp(),  // Ensure the time is stored as a Firebase timestamp
                        "owner": userName  // Correctly assign the userName
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

struct SettingsView: View {
    var body: some View {
        Text("Settings")
            .font(.headline)
    }
}
