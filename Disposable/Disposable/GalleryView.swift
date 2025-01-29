//
//  GalleryView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
import FirebaseFirestore

struct GalleryView: View {
    let eventID: String
    let userName: String

    @State private var selectedTab = 0
    @State private var personalImages: [GalleryImage] = []
    @State private var generalImages: [GalleryImage] = []
    @State private var errorMessage = ""
    @State private var isLoading = true
    @State private var selectedImage: GalleryImage? = nil
    @State private var preloadedFirstImage: UIImage? = nil // Preload the first image
    @State private var isModalVisible = false

    var body: some View {
        VStack {
            // Picker for personal/general
            Picker("Gallery Type", selection: $selectedTab) {
                Text("Personal").tag(0)
                Text("General").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            if isLoading {
                ProgressView("Loading photos...")
                    .padding()
            } else if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            } else {
                if selectedTab == 0 {
                    PhotoGridView(
                        images: personalImages,
                        emptyMessage: "No personal photos yet.",
                        onSelect: { image in
                            preloadFirstImage(for: image) // Preload before opening
                            selectedImage = image
                            isModalVisible = true
                        }
                    )
                } else {
                    PhotoGridView(
                        images: generalImages,
                        emptyMessage: "No photos yet.",
                        onSelect: { image in
                            preloadFirstImage(for: image) // Preload before opening
                            selectedImage = image
                            isModalVisible = true
                        }
                    )
                }
            }
        }
        .navigationTitle("Gallery")
        .onAppear {
            listenForPhotoDocs()
        }
        .sheet(isPresented: $isModalVisible) {
            if let selectedImageIndex = selectedImage.flatMap({ img in generalImages.firstIndex(where: { $0.id == img.id }) }) {
                FullScreenImageView(
                    images: selectedTab == 0 ? personalImages : generalImages,
                    currentIndex: .constant(selectedImageIndex),
                    isPresented: $isModalVisible,
                    preloadedFirstImage: $preloadedFirstImage // Pass preloaded image
                )
            }
        }
    }

    private func listenForPhotoDocs() {
        isLoading = true
        let db = Firestore.firestore()
        let imagesRef = db.collection("events")
            .document(eventID)
            .collection("images")

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

                var allImages: [GalleryImage] = []
                for doc in docs {
                    let data = doc.data()
                    let url = data["url"] as? String ?? ""
                    let owner = data["owner"] as? String ?? "Unknown"
                    allImages.append(GalleryImage(
                        id: doc.documentID,
                        url: url,
                        owner: owner
                    ))
                }

                let personal = allImages.filter { $0.owner == self.userName }
                DispatchQueue.main.async {
                    self.personalImages = personal
                    self.generalImages = allImages
                }
            }
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
}

// MARK: - FullScreenImageView
struct FullScreenImageView: View {
    let images: [GalleryImage]
    @Binding var currentIndex: Int
    @Binding var isPresented: Bool
    @Binding var preloadedFirstImage: UIImage? // Use preloaded image

    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            TabView(selection: $currentIndex) {
                ForEach(images.indices, id: \.self) { index in
                    if index == 0, let preloadedImage = preloadedFirstImage {
                        // Use preloaded image for the first one
                        Image(uiImage: preloadedImage)
                            .resizable()
                            .scaledToFit()
                            .tag(index)
                    } else {
                        AsyncImageView(url: images[index].url)
                            .tag(index)
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


// MARK: - GalleryImage
struct GalleryImage: Identifiable {
    let id: String
    let url: String
    let owner: String
}

// MARK: - PhotoGridView
struct PhotoGridView: View {
    let images: [GalleryImage]
    let emptyMessage: String
    let onSelect: (GalleryImage) -> Void

    let columns = [
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
    ]

    var body: some View {
        if images.isEmpty {
            VStack {
                Text(emptyMessage)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 8) {
                    ForEach(images) { img in
                        PhotoCell(url: img.url)
                            .onTapGesture {
                                onSelect(img) // Trigger modal display
                            }
                    }
                }
                .padding(.horizontal, 8) // Add padding around the grid
            }
        }
    }
}

// MARK: - PhotoCell
struct PhotoCell: View {
    let url: String
    @State private var fetchedImage: UIImage? = nil

    var body: some View {
        ZStack {
            if let uiImage = fetchedImage {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill() // Ensures the image fills the square
                    .frame(width: 100, height: 100) // Explicit square size
                    .clipped() // Ensures the image doesn’t overflow the bounds
            } else {
                // Placeholder for loading state
                Color.gray.opacity(0.3)
                    .frame(width: 100, height: 100)
            }
        }
        .cornerRadius(8) // Optional: Rounded corners
        .onAppear {
            loadImage()
        }
    }

    private func loadImage() {
        guard let imgURL = URL(string: url) else { return }
        URLSession.shared.dataTask(with: imgURL) { data, response, error in
            if let data = data, let uiImg = UIImage(data: data) {
                DispatchQueue.main.async {
                    self.fetchedImage = uiImg
                }
            }
        }.resume()
    }
}

// MARK: - AsyncImageView
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
                Color.gray.opacity(0.3) // Placeholder background
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
