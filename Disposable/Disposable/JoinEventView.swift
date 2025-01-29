//
//  JoinEventView.swift
//  Disposable
//
//  Created by Clementine CUREL on 29/01/2025.
//

import SwiftUI
import FirebaseFirestore

struct JoinEventView: View {
    @Binding var isInEvent: Bool
    @Binding var eventData: [String: Any]?

    @State private var eventIDInput: String = ""
    @State private var userName: String = ""
    @State private var eventExists: Bool = false
    @State private var showJoinEventAlert: Bool = false
    @State private var joinErrorMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Text("Join an Event")
                .font(.title)
                .fontWeight(.bold)

            if !eventExists {
                TextField("Enter event ID", text: $eventIDInput)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                Button(action: {
                    checkEventExists()
                }) {
                    Text("Next")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "#E8D7FF"))
                        .foregroundColor(Color(hex: "#09745F"))
                        .fontWeight(.bold)
                        .cornerRadius(10)
                        .padding(.horizontal, 40)
                }
                .disabled(eventIDInput.isEmpty)
            } else {
                Text("Event found! Enter your name to join.")
                    .foregroundColor(.green)

                TextField("Enter your name", text: $userName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                Button(action: {
                    joinEvent()
                }) {
                    Text("Join")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "#E8D7FF"))
                        .foregroundColor(Color(hex: "#09745F"))
                        .fontWeight(.bold)
                        .cornerRadius(10)
                        .padding(.horizontal, 40)
                }
                .disabled(userName.isEmpty)
                .alert(isPresented: $showJoinEventAlert) {
                    Alert(
                        title: Text(joinErrorMessage == nil ? "Success" : "Error"),
                        message: Text(joinErrorMessage ?? "You have successfully joined the event."),
                        dismissButton: .default(Text("OK"))
                    )
                }
            }
        }
        .padding()
    }

    // 🔹 Step 1: Check if event exists before asking for a name
    private func checkEventExists() {
        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventIDInput)

        eventRef.getDocument { (document, error) in
            if let error = error {
                joinErrorMessage = "Error checking event: \(error.localizedDescription)"
                showJoinEventAlert = true
                return
            }

            guard let document = document, document.exists else {
                joinErrorMessage = "Event not found. Please check the ID."
                showJoinEventAlert = true
                return
            }

            // 🔹 If event exists, enable name input
            DispatchQueue.main.async {
                eventExists = true
                eventData = document.data() // Store event details
            }
        }
    }

    // 🔹 Step 2: Add user as participant after entering name
    private func joinEvent() {
        guard eventExists, !userName.isEmpty else {
            joinErrorMessage = "Please enter your name to join."
            showJoinEventAlert = true
            return
        }

        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventIDInput)

        let userId = UUID().uuidString
        let participantData: [String: Any] = [
            "name": userName,
            "role": "participant",
            "userId": userId
        ]

        eventRef.collection("participants").addDocument(data: participantData) { error in
            if let error = error {
                joinErrorMessage = "Failed to join event: \(error.localizedDescription)"
            } else {
                isInEvent = true
                eventData?["userName"] = userName // Store user name
                joinErrorMessage = nil
            }
            showJoinEventAlert = true
        }
    }
}

