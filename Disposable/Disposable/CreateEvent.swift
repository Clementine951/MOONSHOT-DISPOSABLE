//
//  CreateEvent.swift
//  Disposable
//
//  Created by Clementine CUREL on 12/01/2025.
//

import SwiftUI
import FirebaseFirestore

struct CreateEventView: View {
    @Binding var isInEvent: Bool
    @Binding var eventData: [String: Any]?

    @Environment(\.presentationMode) var presentationMode

    @State private var userName: String = ""
    @State private var eventName: String = ""
    @State private var startNow: Bool = true
    @State private var duration: Int = 8
    @State private var photosReveal: String = "Immediately"
    @State private var photosPerPerson: Int = 5
    @State private var hasAcceptedTerms: Bool = false

    var body: some View {
        VStack {
            Form {
                Section(header: Text("EVENT DETAILS")) {
                    TextField("Your name / pseudo", text: $userName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    TextField("Event name", text: $eventName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }

                Section(header: Text("Start of the event")) {
                    Picker("", selection: $startNow) {
                        Text("Now").tag(true)
                        Text("Start Later").tag(false)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Duration of the event")) {
                    Picker("", selection: $duration) {
                        Text("8h").tag(8)
                        Text("12h").tag(12)
                        Text("24h").tag(24)
                        Text("48h").tag(48)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Photos reveal")) {
                    Picker("", selection: $photosReveal) {
                        Text("Immediately").tag("Immediately")
                        Text("At the end").tag("At the end")
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Photos per person")) {
                    Picker("", selection: $photosPerPerson) {
                        Text("5").tag(5)
                        Text("10").tag(10)
                        Text("15").tag(15)
                        Text("20").tag(20)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }
            }

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
            .toggleStyle(SwitchToggleStyle(tint: .purple))

            // Validate Button
            Button(action: {
                createEvent()
            }) {
                Text("Validate")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(userName.isEmpty || eventName.isEmpty || !hasAcceptedTerms ? Color.gray : Color.purple)
                    .foregroundColor(.white)
                    .fontWeight(.bold)
                    .cornerRadius(10)
                    .padding(.horizontal)
            }
            .disabled(userName.isEmpty || eventName.isEmpty || !hasAcceptedTerms)
        }
        .padding()
        .navigationBarTitle("Creation", displayMode: .inline)
        .navigationBarBackButtonHidden(false)
    }

    private func createEvent() {
        let db = Firestore.firestore()
        let eventId = "\(eventName)_\(UUID().uuidString)"

        let eventDetails: [String: Any] = [
            "eventId": eventId,
            "eventName": eventName,
            "userName": userName,
            "duration": duration,
            "reveal": photosReveal,
            "numberOfPhotos": photosPerPerson,
            
            "startTime": FieldValue.serverTimestamp()
        ]

        db.collection("events").document(eventId).setData(eventDetails) { error in
            if let error = error {
                print("Error saving event: \(error.localizedDescription)")
            } else {
                print("Event created successfully!")

                let organizerData: [String: Any] = [
                    "name": self.userName,
                    "role": "organizer",
                    "userId": UUID().uuidString
                ]

                db.collection("events").document(eventId).collection("participants").addDocument(data: organizerData) { error in
                    if let error = error {
                        print("Error adding organizer to participants: \(error.localizedDescription)")
                    } else {
                        print("Organizer added to participants collection")

                        db.collection("events").document(eventId).getDocument { document, error in
                            if let document = document, document.exists {
                                DispatchQueue.main.async {
                                    self.isInEvent = true
                                    self.eventData = document.data()
                                    self.saveEventState()
                                    self.presentationMode.wrappedValue.dismiss()
                                }
                            }
                        }
                    }
                }
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
