//
//  ContentView.swift
//  Disposable
//
//  Created by Clementine CUREL on 09/01/2025.
//

import SwiftUI
import FirebaseFirestore
import FirebaseStorage

struct ContentView: View {
    var body: some View {
        //Text("Main App Firebase Test")
        Text("Test Firebase Storage")
            .onAppear {
                //testFirestore()
                uploadTestFile()
            }
    }

    func testFirestore() {
        let db = Firestore.firestore()
        db.collection("testCollection").addDocument(data: [
            "app": "main",
            "timestamp": FieldValue.serverTimestamp()
        ]) { error in
            if let error = error {
                print("Main App: Error writing to Firestore: \(error)")
            } else {
                print("Main App: Firestore write successful!")
            }
        }
    }
    
    func uploadTestFile(){
        let storage = Storage.storage()
        let storageRef = storage.reference().child("test-folder/testFile.txt")
        
        let testData = "Hello, Firebase Storage!!!!".data(using: .utf8)!
        
        storageRef.putData(testData, metadata: nil){
            metadata, error in
            if let error = error {
                print("Error uploading file: \(error.localizedDescription)")
            } else {
                print("File uploaded successfully!")
                downloadTestFile()
            }
        
        }
            
    }
    
    func downloadTestFile() {
        let storage = Storage.storage()
        let storageRef = storage.reference().child("test-folder/testFile.txt")

        storageRef.getData(maxSize: 1 * 1024 * 1024) { data, error in
            if let error = error {
                print("Error downloading file: \(error.localizedDescription)")
            } else if let data = data, let content = String(data: data, encoding: .utf8) {
                print("Downloaded file content: \(content)")
            }
        }
    }
}
