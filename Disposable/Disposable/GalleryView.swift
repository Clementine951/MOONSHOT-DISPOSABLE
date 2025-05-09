//
//  GalleryView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
import FirebaseFirestore
import FirebaseStorage
import Photos
import PhotosUI

struct GalleryView: View {

    private func fetchEventDetails() {
        let db = Firestore.firestore()
        db.collection("events").document(eventID).getDocument { document, error in
            if let document = document, document.exists {
                let data = document.data()
                self.revealSetting = data?["reveal"] as? String ?? "Immediately"
                if let duration = data?["duration"] as? Int, let startTime = data?["startTime"] as? Timestamp {
                    self.eventEndTime = startTime.dateValue().addingTimeInterval(TimeInterval(duration * 3600))
                }
            }
        }
    }

    private func listenForPhotoDocs() {
        isLoading = true
        let db = Firestore.firestore()
        let imagesRef = db.collection("events").document(eventID).collection("images")

        imagesRef.order(by: "timestamp", descending: false)
            .addSnapshotListener { snapshot, error in
                self.isLoading = false
                if let error = error {
                    self.errorMessage = "Error fetching images: \(error.localizedDescription)"
                    return
                }

                guard let docs = snapshot?.documents else {
                    self.errorMessage = "No documents found"
                    return
                }

                let allImages = docs.map { doc -> GalleryImage in
                    let data = doc.data()
                    return GalleryImage(id: doc.documentID, url: data["url"] as? String ?? "", owner: data["owner"] as? String ?? "Unknown")
                }

                DispatchQueue.main.async {
                    self.personalImages = allImages.filter { $0.owner == self.userName }
                    self.generalImages = allImages
                }
            }
    }

    private func openImage(_ image: GalleryImage) {
        preloadedFirstImage = nil
        preloadFirstImage(for: image)
        selectedImage = image
        isModalVisible = true
    }

    private func preloadFirstImage(for image: GalleryImage) {
        guard let url = URL(string: image.url) else { return }
        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data, let uiImage = UIImage(data: data) {
                DispatchQueue.main.async {
                    self.preloadedFirstImage = uiImage
                }
            }
        }.resume()
    }
    // MARK: - Properties
    let eventID: String
    let userName: String

    @State private var selectedTab = 0
    @State private var personalImages: [GalleryImage] = []
    @State private var generalImages: [GalleryImage] = []
    @State private var errorMessage = ""
    @State private var isLoading = true
    @State private var selectedImage: GalleryImage? = nil
    @State private var preloadedFirstImage: UIImage? = nil
    @State private var isModalVisible = false
    @State private var isSelecting = false
    @State private var selectedImages: Set<String> = []
    @State private var selectedUIImages: [UIImage] = []
    @State private var isShowingUploadConfirmation = false

    @State private var revealSetting: String = "Immediately"
    @State private var eventEndTime: Date = Date()
    @State private var countdownText: String = ""
    @State private var showingImagePicker = false
    @State private var selectedUIImage: UIImage?


    var hasEventEnded: Bool {
        return Date() >= eventEndTime
    }

    var body: some View {
        VStack {
            Picker("Gallery Type", selection: $selectedTab) {
                Text("Personal").tag(0)
                Text("General").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            

            if revealSetting == "At the end" && !hasEventEnded {
                VStack {
                    Text("Photos will be revealed after the countdown ends")
                        .font(.headline)
                        .foregroundColor(Color(hex: "#FFC3DC"))
                        .padding(.bottom, 10)

                    Text(countdownText)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(Color(hex: "#FFC3DC"))
                }
            }

            if isLoading {
                ProgressView("Loading photos...")
                    .padding()
            } else if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            } else {
                let images = selectedTab == 0 ? personalImages : generalImages
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                        ForEach(images) { image in
                            ZStack(alignment: .topTrailing) {
                                PhotoCell(url: image.url)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(isSelecting && selectedImages.contains(image.id) ? Color.green : Color.clear, lineWidth: 4)
                                    )
                                    .onTapGesture {
                                        if isSelecting {
                                            toggleSelection(image.id)
                                        } else if revealSetting == "At the end" && !hasEventEnded {
                                            return
                                        } else {
                                            openImage(image)
                                        }
                                    }

                                if isSelecting {
                                    Image(systemName: selectedImages.contains(image.id) ? "checkmark.circle.fill" : "circle")
                                        .font(.title2)
                                        .foregroundColor(selectedImages.contains(image.id) ? .green : .white)
                                        .padding(5)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 8)
                }

                if isSelecting {
                    HStack(spacing: 10) {
                        Button("All") {
                            selectedImages = Set(images.map { $0.id })
                        }
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)

                        Button("Download") {
                            requestPhotoLibraryPermission {
                                downloadSelectedImages()
                            }
                        }
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(8)

                        Button("Cancel") {
                            isSelecting = false
                            selectedImages.removeAll()
                        }
                        .padding()
                        .background(Color.red)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                    .padding(.bottom)
                } else if selectedTab == 1 && (revealSetting != "At the end" || hasEventEnded) {
                    HStack(spacing: 10) {
                        Button(action: {
                            isSelecting.toggle()
                            selectedImages.removeAll()
                        }) {
                            Text("Download")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(hex: "#09745F"))
                                .foregroundColor(.white)
                                .fontWeight(.bold)
                                .cornerRadius(10)
                        }

                        if let eventURL = URL(string: "https://disposableapp.xyz/html/template.html?eventId=\(eventID)") {
                            Link(destination: eventURL) {
                                Text("Online Gallery")
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color(hex: "#09745F"))
                                    .foregroundColor(.white)
                                    .fontWeight(.bold)
                                    .cornerRadius(10)
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                }
            }
            if selectedTab == 0 {
                HStack(spacing: 10) {
                    Button(action: {
                        requestPhotoPickerPermission()
                    }) {
                        Text("Upload Photos")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "#09745F"))
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                            .cornerRadius(10)
                    }

                    Button(action: {
                        deleteSelectedPersonalPhotos()
                    }) {
                        Text("Delete Photos")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.red)
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                            .cornerRadius(10)
                    }
                }
                .padding(.horizontal)
                .padding(.bottom)
            }
        }
        
        .navigationTitle("Gallery")
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(images: $selectedUIImages)
                .onDisappear {
                    if !selectedUIImages.isEmpty {
                        isShowingUploadConfirmation = true
                    }
                }
        }
        .alert("Upload selected photos?", isPresented: $isShowingUploadConfirmation, actions: {
            Button("Upload", role: .none) {
                for img in selectedUIImages {
                    uploadImageToFirestore(image: img)
                }
                selectedUIImages.removeAll()
            }
            Button("Cancel", role: .cancel) {
                selectedUIImages.removeAll()
            }
        })

        .onAppear {
            fetchEventDetails()
            listenForPhotoDocs()
        }
        .sheet(isPresented: $isModalVisible) {
            if let selectedImageIndex = selectedImage.flatMap({ img in (selectedTab == 0 ? personalImages : generalImages).firstIndex(where: { $0.id == img.id }) }) {
                FullScreenImageView(
                    images: selectedTab == 0 ? personalImages : generalImages,
                    currentIndex: .constant(selectedImageIndex),
                    isPresented: $isModalVisible,
                    preloadedFirstImage: $preloadedFirstImage
                )
            }
        }
    }

        private func toggleSelection(_ id: String) {
        if selectedImages.contains(id) {
            selectedImages.remove(id)
        } else {
            selectedImages.insert(id)
        }
    }

    private func requestPhotoLibraryPermission(completion: @escaping () -> Void) {
        PHPhotoLibrary.requestAuthorization { status in
            if status == .authorized || status == .limited {
                completion()
            } else {
                print("Photo Library permission denied.")
            }
        }
    }

    private func downloadSelectedImages() {
        let images = selectedTab == 0 ? personalImages : generalImages
        let toDownload = images.filter { selectedImages.contains($0.id) }

        for image in toDownload {
            if let url = URL(string: image.url) {
                URLSession.shared.dataTask(with: url) { data, _, _ in
                    if let data = data, let uiImage = UIImage(data: data) {
                        saveImageToPhotoLibrary(uiImage)
                    }
                }.resume()
            }
        }

        DispatchQueue.main.async {
            isSelecting = false
            selectedImages.removeAll()
        }
    }

    private func saveImageToPhotoLibrary(_ image: UIImage) {
        PHPhotoLibrary.shared().performChanges({
            PHAssetChangeRequest.creationRequestForAsset(from: image)
        }) { success, error in
            if success {
                print("Image saved to photo library")
            } else if let error = error {
                print("Error saving image: \(error.localizedDescription)")
            }
        }
    }
    private func requestPhotoPickerPermission() {
        PHPhotoLibrary.requestAuthorization { status in
            if status == .authorized || status == .limited {
                showingImagePicker = true
            } else {
                print("Photo picker access denied.")
            }
        }
    }
    private func uploadImageToFirestore(image: UIImage) {
        guard let data = image.jpegData(compressionQuality: 0.8) else { return }
        let imageName = "\(UUID().uuidString).jpg"
        let storageRef = Storage.storage().reference().child("events/\(eventID)/\(imageName)")

        let metadata = StorageMetadata()
        metadata.contentType = "image/jpeg"
        metadata.customMetadata = ["user": userName, "eventId": eventID]

        storageRef.putData(data, metadata: metadata) { _, error in
            if let error = error {
                print("Upload error: \(error.localizedDescription)")
                return
            }

            storageRef.downloadURL { url, error in
                guard let downloadURL = url else { return }
                let doc = Firestore.firestore().collection("events").document(eventID).collection("images").document()
                doc.setData([
                    "url": downloadURL.absoluteString,
                    "owner": userName,
                    "timestamp": Date().timeIntervalSince1970
                ]) { _ in
                    listenForPhotoDocs()
                }
            }
        }
    }
    private func deleteSelectedPersonalPhotos() {
        let db = Firestore.firestore()
        let toDelete = personalImages.filter { selectedImages.contains($0.id) }

        for image in toDelete {
            db.collection("events").document(eventID).collection("images").document(image.id).delete()
            // Also delete from Firebase Storage (optional)
            let filename = URL(string: image.url)?.lastPathComponent ?? ""
            let storageRef = Storage.storage().reference().child("events/\(eventID)/\(filename)")
            storageRef.delete(completion: nil)
        }

        selectedImages.removeAll()
    }

}

struct GalleryImage: Identifiable {
    let id: String
    let url: String
    let owner: String
}

struct PhotoCell: View {
    let url: String
    @State private var fetchedImage: UIImage? = nil

    var body: some View {
        ZStack {
            if let uiImage = fetchedImage {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 100, height: 100)
                    .clipped()
            } else {
                Color.gray.opacity(0.3)
                    .frame(width: 100, height: 100)
            }
        }
        .cornerRadius(8)
        .onAppear {
            loadImage()
        }
    }

    private func loadImage() {
        guard let imgURL = URL(string: url) else { return }
        URLSession.shared.dataTask(with: imgURL) { data, _, _ in
            if let data = data, let uiImg = UIImage(data: data) {
                DispatchQueue.main.async {
                    self.fetchedImage = uiImg
                }
            }
        }.resume()
    }
}

struct FullScreenImageView: View {
    let images: [GalleryImage]
    @Binding var currentIndex: Int
    @Binding var isPresented: Bool
    @Binding var preloadedFirstImage: UIImage?

    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            TabView(selection: $currentIndex) {
                ForEach(images.indices, id: \.self) { index in
                    VStack {
                        Spacer()

                        if index == currentIndex, let preloadedImage = preloadedFirstImage {
                            Image(uiImage: preloadedImage)
                                .resizable()
                                .scaledToFit()
                                .tag(index)
                        } else {
                            AsyncImageView(url: images[index].url)
                                .tag(index)
                        }

                        Spacer()

                        Text("Photo by: \(images[index].owner)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.bottom, 20)
                    }
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .always))

            VStack {
                HStack {
                    Spacer()
                    Button(action: { isPresented = false }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.white)
                            .font(.system(size: 30))
                    }
                    .padding()
                }
                Spacer()
            }
        }
    }
}

struct AsyncImageView: View {
    let url: String
    @State private var image: UIImage? = nil

    var body: some View {
        ZStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
            } else {
                Color.gray.opacity(0.3)
                ProgressView()
                    .onAppear(perform: loadImage)
            }
        }
    }

    private func loadImage() {
        guard let imageUrl = URL(string: url) else { return }
        URLSession.shared.dataTask(with: imageUrl) { data, _, _ in
            if let data = data, let loadedImage = UIImage(data: data) {
                DispatchQueue.main.async {
                    self.image = loadedImage
                }
            }
        }.resume()
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var images: [UIImage]

    @Environment(\.presentationMode) var presentationMode

    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.selectionLimit = 0
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
            let group = DispatchGroup()
            var uiImages: [UIImage] = []

            for result in results {
                if result.itemProvider.canLoadObject(ofClass: UIImage.self) {
                    group.enter()
                    result.itemProvider.loadObject(ofClass: UIImage.self) { object, _ in
                        if let image = object as? UIImage {
                            DispatchQueue.main.async {
                                uiImages.append(image)
                            }
                        }
                        group.leave()
                    }
                }
            }

            group.notify(queue: .main) {
                self.parent.images = uiImages
            }
        }
    }
}
