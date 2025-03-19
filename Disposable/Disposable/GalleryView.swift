//
//  GalleryView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
import FirebaseFirestore
import Photos

struct GalleryView: View {
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
    
    @State private var revealSetting: String = "Immediately"
    @State private var eventEndTime: Date = Date()
    @State private var countdownText: String = ""

    var hasEventEnded: Bool {
        return Date() >= eventEndTime
    }

    var body: some View {
        VStack {
            // Picker for personal/general
            Picker("Gallery Type", selection: $selectedTab) {
                Text("Personal").tag(0)
                Text("General").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
//            .disabled(revealSetting == "At the end" && !hasEventEnded)

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
                if selectedTab == 0 {
                    if personalImages.isEmpty {
                        VStack {
                            Text("Here will be displayed your photos")
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        PhotoGridView(images: personalImages, emptyMessage: "", onSelect: openImage)
                    }
                } else {
                    if generalImages.isEmpty {
                        VStack {
                            Text("Here will be displayed every photo")
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        PhotoGridView(
                            images: generalImages,
                            emptyMessage: "",
                            onSelect: { image in
                                if revealSetting == "At the end" && !hasEventEnded { return }
                                openImage(image)
                            },
                            blurImages: revealSetting == "At the end" && !hasEventEnded
                        )
                    }
                }
                if revealSetting == "At the end" && !hasEventEnded {
                    // Hide buttons until countdown ends
                } else {
                    HStack(spacing: 10) {
                        Button(action: { isSelecting.toggle() }) {
                            Text("Select Photos")
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
        }
        .navigationTitle("Gallery")
        .onAppear {
            fetchEventDetails()
            listenForPhotoDocs()
        }
        .sheet(isPresented: $isModalVisible) {
            if let selectedImageIndex = selectedImage.flatMap({ img in generalImages.firstIndex(where: { $0.id == img.id }) }) {
                FullScreenImageView(
                    images: selectedTab == 0 ? personalImages : generalImages,
                    currentIndex: .constant(selectedImageIndex),
                    isPresented: $isModalVisible,
                    preloadedFirstImage: $preloadedFirstImage
                )
            }
        }
    }

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
}


// MARK: - FullScreenImageView
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
                            // Use preloaded image for the selected image
                            Image(uiImage: preloadedImage)
                                .resizable()
                                .scaledToFit()
                                .tag(index)
                        } else {
                            AsyncImageView(url: images[index].url)
                                .tag(index)
                        }

                        Spacer()

                        // Owner's name displayed under the image
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
    var blurImages: Bool = false

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
                        ZStack{
                            PhotoCell(url: img.url)
                                .blur(radius: blurImages ? 10 : 0)
                                .onTapGesture {
                                    if !blurImages {
                                        onSelect(img)
                                    }
                                }
                        }
                    }
                }
                .padding(.horizontal, 8)
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
