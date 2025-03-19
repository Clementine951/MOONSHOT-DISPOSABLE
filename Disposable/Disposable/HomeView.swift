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
    
    @State private var showEndEventAlert = false
    @State private var showEventDeletedAlert = false
    
    @State private var showShareSheet = false



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
                        .foregroundColor(Color(hex: "#FFC3DC"))

                    Text(countdownText)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(Color(hex: "#FFC3DC"))

                    // QR Code
                    if let qrCodeImage = qrCodeImage {
                        Image(uiImage: qrCodeImage)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 200, height: 200)
                        
                        Button(action: shareQRCode) {
                                                    HStack {
                                                        Text("Share QR Code")
                                                    }
                                                    .frame(maxWidth: .infinity)
                                                    .padding()
                                                    .background(Color(hex: "#E8D7FF"))
                                                    .foregroundColor(Color(hex: "#09745F"))
                                                    .fontWeight(.bold)
                                                    .cornerRadius(10)
                                                    .padding(.horizontal)
                                                }
                    }

                    // Buttons for event actions
                    VStack() {
                        if let role = eventData["role"] as? String, role == "organizer" {
                            Button(action: shareEventWebsite) {
                                HStack {
                                    Text("Share Website")
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(hex: "#E8D7FF"))
                                .foregroundColor(Color(hex: "#09745F"))
                                .fontWeight(.bold)
                                .cornerRadius(10)
                                .padding(.horizontal)
                                
                            }
                            Button(action: {
                                showEndEventAlert = true // Show confirmation popup
                            }) {
                                Text("End The Event")
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color(hex: "#09745F"))
                                    .foregroundColor(Color(hex: "#E8D7FF"))
                                    .fontWeight(.bold)
                                    .cornerRadius(10)
                                    .padding(.horizontal)
                            }
                            .alert("Are you sure?", isPresented: $showEndEventAlert) {
                                Button("Cancel", role: .cancel) {}
                                Button("End Event", role: .destructive) {
                                    endEvent() // Call endEvent() only if confirmed
                                }
                            } message: {
                                Text("This event and all its photos will be permanently deleted.")
                            }
                        } else {
                            Button(action: {
                                leaveEvent()
                            }) {
                                Text("Leave Event")
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color(hex: "#09745F"))
                                    .foregroundColor(Color(hex: "#E8D7FF"))
                                    .fontWeight(.bold)
                                    .cornerRadius(10)
                                    .padding(.horizontal)
                            }
                        }
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

                        NavigationLink(destination: JoinEventView(isInEvent: $isInEvent, eventData: $eventData)) {
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
                restoreEventState()
                print("Current eventData: \(eventData ?? [:])") // Debugging

                if isInEvent {
                    fetchParticipantsCount()
                    startCountdown()
                    generateQRCode()
                    fetchUserRole() // Fetch the role separately
                    checkIfEventStillExists()
                    
                    // Periodically check if the event still exists
                    Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { _ in
                        checkIfEventStillExists()
                    }
                }
            }
            .alert("Event Deleted", isPresented: $showEventDeletedAlert) {
                        Button("OK") {
                            leaveEvent()
                        }
                    } message: {
                        Text("The event has been deleted by the organizer. Returning to the homepage.")
                    }
        }
    }
    
    private func shareEventWebsite() {
        guard let eventId = eventData?["eventId"] as? String else { return }
        
        let eventURL = "https://disposableapp.xyz/html/template.html?eventId=\(eventId)s"
        let message = "Check out the full gallery for the event! \(eventURL)"

        let activityVC = UIActivityViewController(activityItems: [message], applicationActivities: nil)
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootViewController = windowScene.windows.first?.rootViewController {
            rootViewController.present(activityVC, animated: true)
        }
    }

    
    private func fetchUserRole() {
        guard let eventId = eventData?["eventId"] as? String,
              let userName = eventData?["userName"] as? String else { return }

        let db = Firestore.firestore()
        let participantsRef = db.collection("events").document(eventId).collection("participants")

        participantsRef.whereField("name", isEqualTo: userName).getDocuments { snapshot, error in
            if let error = error {
                print("Error fetching role: \(error.localizedDescription)")
            } else if let document = snapshot?.documents.first {
                let role = document.data()["role"] as? String ?? "participant"
                print("Fetched role: \(role)")
                
                DispatchQueue.main.async {
                    eventData?["role"] = role
                }
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
            }
        }
    }
    
    private func shareQRCode() {
            guard let qrCodeImage = qrCodeImage, let eventName = eventData?["eventName"] as? String else { return }

            let message = "Scan this QR code to join \(eventName)!"
            let activityVC = UIActivityViewController(activityItems: [message, qrCodeImage], applicationActivities: nil)

            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootViewController = windowScene.windows.first?.rootViewController {
                rootViewController.present(activityVC, animated: true)
            }
    }

    private func generateQRCode() {
        guard let eventId = eventData?["eventId"] as? String else { return }

        let url = "https://appclip.disposableapp.xyz/clip?eventId=\(eventId)"
        let context = CIContext()
        guard let filter = CIFilter(name: "CIQRCodeGenerator") else { return }

        filter.setValue(Data(url.utf8), forKey: "inputMessage")
        filter.setValue("M", forKey: "inputCorrectionLevel")

        if let outputImage = filter.outputImage,
           let cgImage = context.createCGImage(outputImage, from: outputImage.extent) {
            self.qrCodeImage = UIImage(cgImage: cgImage)
        }
    }

    private func restoreEventState() {
        if let savedData = UserDefaults.standard.data(forKey: "currentEventData"),
           var decodedData = try? JSONSerialization.jsonObject(with: savedData, options: []) as? [String: Any] {
            
            // Convert stored UNIX timestamp back to Firestore Timestamp
            if let startTime = decodedData["startTime"] as? Double {
                decodedData["startTime"] = Timestamp(date: Date(timeIntervalSince1970: startTime))
            }

            self.eventData = decodedData
            self.isInEvent = UserDefaults.standard.bool(forKey: "isInEvent")
            
            print("Restored event: \(eventData ?? [:])")
        }
    }



    private func endEvent() {
        guard let eventId = eventData?["eventId"] as? String else { return }

        let db = Firestore.firestore()
        let eventDocRef = db.collection("events").document(eventId)

        // Delete participants
        eventDocRef.collection("participants").getDocuments { snapshot, error in
            if let snapshot = snapshot {
                for document in snapshot.documents {
                    document.reference.delete()
                }
            }
        }

        // Delete images
        eventDocRef.collection("images").getDocuments { snapshot, error in
            if let snapshot = snapshot {
                for document in snapshot.documents {
                    document.reference.delete()
                }
            }
        }

        // Delete event
        eventDocRef.delete { error in
            if error == nil {
                UserDefaults.standard.removeObject(forKey: "currentEventData")
                UserDefaults.standard.set(false, forKey: "isInEvent")
                isInEvent = false
                eventData = nil
            }
        }
    }

    private func leaveEvent() {
        print("Leaving event...")
        UserDefaults.standard.removeObject(forKey: "currentEventData")
        UserDefaults.standard.set(false, forKey: "isInEvent")
        
        DispatchQueue.main.async {
            isInEvent = false
            eventData = nil
        }
    }

    
    private func checkIfEventStillExists() {
        guard let eventId = eventData?["eventId"] as? String else { return }

        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventId)

        eventRef.getDocument { document, error in
            if let error = error {
                print("Error checking event: \(error.localizedDescription)")
                showEventDeletedAlert = true // Show alert before leaving
            } else if document?.exists == false {
                print("Event no longer exists. Leaving event...")
                showEventDeletedAlert = true // Show alert before leaving
            }
        }
    }
    private func saveEventState() {
        if let eventData = eventData {
            var sanitizedEventData = eventData
            
            // Convert FIRTimestamp to a UNIX timestamp (Double)
            if let startTime = eventData["startTime"] as? Timestamp {
                sanitizedEventData["startTime"] = startTime.dateValue().timeIntervalSince1970
            }

            // Save to UserDefaults
            if let savedData = try? JSONSerialization.data(withJSONObject: sanitizedEventData, options: []) {
                UserDefaults.standard.set(savedData, forKey: "currentEventData")
                UserDefaults.standard.set(true, forKey: "isInEvent")
            }
        }
    }


}
