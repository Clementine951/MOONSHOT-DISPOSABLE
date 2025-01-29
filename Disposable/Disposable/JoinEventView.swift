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
    @State private var showJoinEventAlert: Bool = false
    @State private var joinErrorMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Text("Join an Event")
                .font(.title)
                .fontWeight(.bold)
            
            TextField("Enter event ID", text: $eventIDInput)
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
            .alert(isPresented: $showJoinEventAlert) {
                Alert(
                    title: Text(joinErrorMessage == nil ? "Success" : "Error"),
                    message: Text(joinErrorMessage ?? "You have successfully joined the event."),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
        .padding()
    }

    private func joinEvent() {
        guard !eventIDInput.isEmpty else {
            joinErrorMessage = "Please enter an event ID."
            showJoinEventAlert = true
            return
        }
        
        let db = Firestore.firestore()
        let eventRef = db.collection("events").document(eventIDInput)
        
        eventRef.getDocument { (document, error) in
            if let error = error {
                joinErrorMessage = "Error retrieving event: \(error.localizedDescription)"
                showJoinEventAlert = true
                return
            }
            
            guard let document = document, document.exists else {
                joinErrorMessage = "Event not found. Please check the ID."
                showJoinEventAlert = true
                return
            }
            
            let userId = UUID().uuidString
            let participantData: [String: Any] = [
                "name": "Guest User",
                "role": "participant",
                "userId": userId
            ]
            
            eventRef.collection("participants").addDocument(data: participantData) { error in
                if let error = error {
                    joinErrorMessage = "Failed to join event: \(error.localizedDescription)"
                } else {
                    isInEvent = true
                    eventData = document.data()
                    joinErrorMessage = nil
                }
                showJoinEventAlert = true
            }
        }
    }
}
