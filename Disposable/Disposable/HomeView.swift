//
//  HomeView.swift
//  Disposable
//
//  Created by Clementine CUREL on 11/01/2025.
//

import SwiftUI
import FirebaseFirestore

extension Color {
    init(hex: String) {
        var cleanHexCode = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        cleanHexCode = cleanHexCode.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        guard Scanner(string: cleanHexCode).scanHexInt64(&rgb) else {
            self = .clear
            return
        }

        let redValue = Double((rgb >> 16) & 0xFF) / 255.0
        let greenValue = Double((rgb >> 8) & 0xFF) / 255.0
        let blueValue = Double(rgb & 0xFF) / 255.0
        self.init(red: redValue, green: greenValue, blue: blueValue)
    }
}

struct HomeView: View {
    @Binding var isInEvent: Bool
    @Binding var eventData: [String: Any]?
    
    @State private var participantsCount: Int = 0
    @State private var countdownText: String = ""
    @State private var qrCodeImage: UIImage?

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                if isInEvent, let eventData = eventData {
                    // Display Event Details
                    Text(eventData["eventName"] as? String ?? "Event Name")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(Color(hex: "#09745F"))

                    Text(eventData["userName"] as? String ?? "Organizer Name")
                        .font(.subheadline)
                        .foregroundColor(Color(hex: "#09745F"))
                    
                    Text("\(participantsCount) participants")
                        .font(.subheadline)
                        .foregroundStyle(Color(hex: "#09745F"))

                    // Countdown Timer
                    Text("End of the event in")
                        .font(.subheadline)
                        .foregroundColor(Color(hex: "#09745F"))

                    Text(countdownText)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.red)
                    
                    // QR Code
                    if let qrCodeImage = qrCodeImage {
                        Image(uiImage: qrCodeImage)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 200, height: 200)
                    }

                    // Buttons
                    Button(action: {
                        shareEvent()
                    }) {
                        Text("Share event")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "#E8D7FF"))
                            .foregroundColor(Color(hex: "#09745F"))
                            .fontWeight(.bold)
                            .cornerRadius(10)
                            .padding(.horizontal)
                    }

                    Button(action: {
                        endEvent()
                    }) {
                        Text("End event")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "#E8D7FF"))
                            .foregroundColor(Color(hex: "#09745F"))
                            .fontWeight(.bold)
                            .cornerRadius(10)
                            .padding(.horizontal)
                    }

                } else {
                    // Default Home View
                    Spacer()

                    VStack {
                        Image("Logo")
                            .resizable()
                            .scaledToFit()
                            .padding(30)
                    }

                    Spacer()

                    VStack(spacing: 16) {
                        NavigationLink(destination: CreateEventView(isInEvent: $isInEvent, eventData: $eventData)) {
                            Text("Create an event")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(hex: "#E8D7FF"))
                                .foregroundColor(Color(hex: "#09745F"))
                                .fontWeight(.bold)
                                .cornerRadius(10)
                                .padding(.horizontal, 40)
                        }

                        Button(action: {
                            print("Join event tapped")
                        }) {
                            Text("Join an event")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(hex: "#E8D7FF"))
                                .foregroundColor(Color(hex: "#09745F"))
                                .fontWeight(.bold)
                                .cornerRadius(10)
                                .padding(.horizontal, 40)
                        }
                    }

                    Spacer()
                }
            }
            .padding()
            .onAppear {
                fetchParticipantsCount()
                startCountdown()
                generateQRCode()
            }
        }
    }

    private func fetchParticipantsCount() {
        guard let eventId = eventData?["eventId"] as? String else { return }

        let db = Firestore.firestore()
        let participantsRef = db.collection("events").document(eventId).collection("participants")

        participantsRef.getDocuments { snapshot, error in
            if let error = error {
                print("Error fetching participants count: \(error.localizedDescription)")
                self.participantsCount = 0
            } else {
                self.participantsCount = snapshot?.documents.count ?? 0
                print("Participants count fetched: \(self.participantsCount)")
            }
        }
    }

    private func startCountdown() {
        guard let duration = eventData?["duration"] as? Int,
              let startTime = eventData?["startTime"] as? Timestamp else { return }

        let endTime = startTime.dateValue().addingTimeInterval(TimeInterval(duration * 3600))
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            let remainingTime = endTime.timeIntervalSince(Date())
            if remainingTime > 0 {
                let hours = Int(remainingTime) / 3600
                let minutes = (Int(remainingTime) % 3600) / 60
                let seconds = Int(remainingTime) % 60
                self.countdownText = String(format: "%02d:%02d:%02d", hours, minutes, seconds)
            } else {
                self.countdownText = "00:00:00"
                timer.invalidate()
//                isInEvent = false
//                eventData = nil
            }
        }
    }
    
    private func generateQRCode(){
        guard let eventId = eventData?["eventId"] as? String else {return}
        
        let url = "https://appclip.disposableapp.xyz/clip?eventId=\(eventId)"
        let context = CIContext()
        guard let filter = CIFilter(name: "CIQRCodeGenerator") else {
            print("Failed to create QR code generator filter")
            return
        }

        filter.setValue(Data(url.utf8), forKey: "inputMessage")
        // Medium error correction
        filter.setValue("M", forKey: "inputCorrectionLevel")
        
        if let outputImage = filter.outputImage,
           let cgImage = context.createCGImage(outputImage, from: outputImage.extent){
            self.qrCodeImage = UIImage(cgImage: cgImage)
        }
    }
    
    private func shareQRCode(){
        guard let qrCodeImage = qrCodeImage else {return}
        
        let activityController = UIActivityViewController(activityItems: [qrCodeImage], applicationActivities: nil)
        UIApplication.shared.windows.first?.rootViewController?.present(activityController, animated: true)
    }

    private func shareEvent() {
        print("Share event tapped")
        // Add functionality to share event (e.g., share event link via UIActivityViewController)
    }

    private func endEvent() {
        guard let eventId = eventData?["eventId"] as? String else {
            print("No event ID found")
            return
        }
        
        let db = Firestore.firestore()
        
        // ref to event document
        let eventDocRef = db.collection("events").document(eventId)
        
        // start by subcollections
        eventDocRef.collection("participants").getDocuments{ (snapshot, error) in
            if let error = error{
                print("Error fetching participants: \(error.localizedDescription)")
            } else if let documents = snapshot?.documents {
                for document in documents{
                    document.reference.delete{
                        error in
                        if let error = error {
                            print("error deleting participants: \(error.localizedDescription)")
                        }else{
                            print("Participants deleted: \(document.documentID)")
                        }
                    }
                }
            }
        }
        
        eventDocRef.collection("images").getDocuments{(snapshot, error) in
            if let error = error {
                print("Error fetching images: \(error.localizedDescription)")
            } else if let documents = snapshot?.documents {
                for document in documents {
                    document.reference.delete { error in
                        if let error = error{
                            print("error deleting image: \(error.localizedDescription)")
                        } else {
                            print("image document deleted: \(document.documentID)")
                        }
                    }
                }
                
            }
        }
        
        eventDocRef.delete { error in
            if let error = error {
                print("Error deleting event: \(error.localizedDescription)")
            } else {
                print("Event deleted ")
                isInEvent = false
                eventData =  nil
            }
        }
    }
}


struct StatefulPreviewWrapper<Value1, Value2, Content: View>: View {
    @State private var value1: Value1
    @State private var value2: Value2
    private let content: (Binding<Value1>, Binding<Value2>) -> Content

    init(_ initialValue1: Value1, _ initialValue2: Value2, @ViewBuilder content: @escaping (Binding<Value1>, Binding<Value2>) -> Content) {
        _value1 = State(initialValue: initialValue1)
        _value2 = State(initialValue: initialValue2)
        self.content = content
    }

    var body: some View {
        content($value1, $value2)
    }
}

//struct HomeView_Previews: PreviewProvider {
//    static var previews: some View {
//        StatefulPreviewWrapper(false, nil as [String: Any]?) { isInEvent, eventData in
//            NavigationView {
//                HomeView(isInEvent: isInEvent, eventData: eventData)
//            }
//        }
//    }
//}
