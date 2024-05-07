// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSLu5sDvmvbEhezBRiXCriUBwU7c2gFxA",
  authDomain: "disposable-6bb77.firebaseapp.com",
  projectId: "disposable-6bb77",
  storageBucket: "disposable-6bb77.appspot.com",
  messagingSenderId: "209954740040",
  appId: "1:209954740040:web:dbb98432b3c90eb432c57d",
  measurementId: "G-Y7MBKJ9PS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage };
