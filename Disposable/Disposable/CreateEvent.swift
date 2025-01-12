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

    var body: some View {
        VStack {
            Form {
                Section(header: Text("EVENT DETAILS")) {
                    TextField("Your Name", text: $userName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    TextField("Event Name", text: $eventName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }

                Section(header: Text("Start of the Event")) {
                    Picker("", selection: $startNow) {
                        Text("Now").tag(true)
                        Text("Start Later").tag(false)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Duration of the Event")) {
                    Picker("", selection: $duration) {
                        Text("8h").tag(8)
                        Text("12h").tag(12)
                        Text("24h").tag(24)
                        Text("48h").tag(48)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Photos Reveal")) {
                    Picker("", selection: $photosReveal) {
                        Text("Immediately").tag("Immediately")
                        Text("At the end").tag("At the end")
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }

                Section(header: Text("Photos per Person")) {
                    Picker("", selection: $photosPerPerson) {
                        Text("5").tag(5)
                        Text("10").tag(10)
                        Text("15").tag(15)
                        Text("20").tag(20)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }
            }

            // Validate Button
            Button(action: {
                createEvent()
            }) {
                Text("Validate")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(userName.isEmpty || eventName.isEmpty ? Color.gray : Color.purple)
                    .foregroundColor(.white)
                    .fontWeight(.bold)
                    .cornerRadius(10)
                    .padding(.horizontal)
            }
            .disabled(userName.isEmpty || eventName.isEmpty)
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

                let participantDetails: [String: Any] = [
                    "name": self.userName,
                    "role": "organizer",
                    "userId": UUID().uuidString // Generate random ID
                ]

                db.collection("events").document(eventId).collection("participants").addDocument(data: participantDetails) { error in
                    if let error = error {
                        print("Error adding organizer to participants: \(error.localizedDescription)")
                    } else {
                        print("Organizer added to participants collection")
                        DispatchQueue.main.async {
                            self.isInEvent = true
                            self.eventData = eventDetails
                            self.presentationMode.wrappedValue.dismiss() // Dismiss after updating eventData
                        }
                    }
                }
            }
        }
    }

}

// Preview
struct CreateEventView_Previews: PreviewProvider {
    @State static var isInEvent = false
    @State static var eventData: [String: Any]? = nil

    static var previews: some View {
        NavigationView {
            CreateEventView(isInEvent: $isInEvent, eventData: $eventData)
        }
    }
}
