import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWXnvNsQ7A5qAP0qMvVQx7YlD8htZU6LA",
  authDomain: "disposablecamera-5c3fa.firebaseapp.com",
  projectId: "disposablecamera-5c3fa",
  storageBucket: "disposablecamera-5c3fa.appspot.com",
  messagingSenderId: "181466114591",
  appId: "1:181466114591:web:4359f9056f5a8a4249032a"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };