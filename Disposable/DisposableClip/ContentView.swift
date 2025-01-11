//
//  ContentView.swift
//  DisposableClip
//
//  Created by Clementine CUREL on 09/01/2025.
//

import SwiftUI
import FirebaseStorage
import FirebaseFirestore

struct ContentView: View {
    var body: some View {
        Text("App clip Firebase storage test")
            .onAppear{
                // for storage
                //uploadTestFile()
                testFirestore()
            }
    }
    
    // for storage
    func uploadTestFile(){
        let storage = Storage.storage()
        let storageRef = storage.reference().child("app-clip/testFile.txt")
        
        let testData = "Hello from App clip!@!!!".data(using: .utf8)!
        
        storageRef.putData(testData, metadata: nil) { result in
            switch result {
            case .success(let metadata):
                print("File uploaded successfully! Metadata: \(metadata)")
                downloadTestFile() // Proceed to verify the upload by downloading
            case .failure(let error):
                print("Error uploading file: \(error.localizedDescription)")
            }
        }

    }
    
    func downloadTestFile() {
        let storage = Storage.storage()
        let storageRef = storage.reference().child("app-clip/testFile.txt")

        storageRef.getData(maxSize: 1 * 1024 * 1024) { data, error in
            if let error = error {
                print("App Clip: Error downloading file: \(error.localizedDescription)")
            } else if let data = data, let content = String(data: data, encoding: .utf8) {
                print("App Clip: Downloaded file content: \(content)")
            }
        }
    }
    
    // for db
    func testFirestore(){
        let db = Firestore.firestore()
        
        db.collection("appClipTestCollection").addDocument(data: [
            "app": "App Clip",
            "timestamp": FieldValue.serverTimestamp()
        ]) {error in
            if let error = error {
                print("App clip: Firestore write error: \(error.localizedDescription)")
            } else {
                print("app clip: firestore write succefully!")
                readTestFirestore()
            }
        }
    }
    
    func readTestFirestore(){
        let db = Firestore.firestore()
        
        db.collection("appClipTestCollection").getDocuments {
            snapshot, error in
            if let error = error{
                print("App clip: firestore read error: \(error.localizedDescription)")
            } else if let snapshot = snapshot{
                for document in snapshot.documents {
                    print("app clip: retrieved ducment: \(document.data())")
                }
            }
            
        }
    }
}
