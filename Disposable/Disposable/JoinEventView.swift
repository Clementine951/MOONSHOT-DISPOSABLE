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
    @State private var hasAcceptedTerms: Bool = false
    
    var initialEventId: String? = nil
    
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        VStack(spacing: 20) {
            Text("Join an Event")
                .font(.title)
                .fontWeight(.bold)

            if !eventExists && initialEventId == nil {
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
            } else if eventExists {
                Text("Event found! Enter your name to join.")
                    .foregroundColor(.green)

                TextField("Enter your name", text: $userName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()

                // Terms and Conditions toggle
                Toggle(isOn: $hasAcceptedTerms) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("I agree to the")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        HStack {
                            NavigationLink(destination: PrivacyPolicyView()) {
                                Text("Privacy Policy")
                                    .underline()
                                    .foregroundColor(.blue)
                            }
                            Text("and")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            NavigationLink(destination: TermsAndConditionsView()) {
                                Text("Terms and Conditions")
                                    .underline()
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                }
                .padding()
                .toggleStyle(SwitchToggleStyle(tint: .green))

                // Join Button
                Button(action: {
                    joinEvent()
                }) {
                    Text("Join")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(userName.isEmpty || !hasAcceptedTerms ? Color.gray : Color(hex: "#E8D7FF"))
                        .foregroundColor(userName.isEmpty || !hasAcceptedTerms ? .white : Color(hex: "#09745F"))
                        .fontWeight(.bold)
                        .cornerRadius(10)
                        .padding(.horizontal, 40)
                }
                .disabled(userName.isEmpty || !hasAcceptedTerms)
                .alert(isPresented: $showJoinEventAlert) {
                    Alert(
                        title: Text(joinErrorMessage == nil ? "Success" : "Error"),
                        message: Text(joinErrorMessage ?? "You have successfully joined the event."),
                        dismissButton: .default(Text("OK")){
                            if (joinErrorMessage == nil) {
                                presentationMode.wrappedValue.dismiss()
                            }
                        }
                    )
                }
            }
        }
        .padding()
        .onAppear{
            if let id = initialEventId{
                eventIDInput = id
                if !eventExists {
                    checkEventExists()
                }
            }
        }
    }

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

            DispatchQueue.main.async {
                eventExists = true
                eventData = document.data()
            }
        }
    }

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
                eventData?["userName"] = userName
                saveEventState()
                joinErrorMessage = nil
            }
            showJoinEventAlert = true
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
