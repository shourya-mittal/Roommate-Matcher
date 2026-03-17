// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxXgXgXgXgXgXgXgXgXgXgXgXgXgXgXg",
  authDomain: "roommatematcher-fc577.firebaseapp.com",
  projectId: "roommatematcher-fc577",
  storageBucket: "roommatematcher-fc577.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEF1234"
};
console.log("PROJECT ID:", process.env.REACT_APP_FIREBASE_PROJECT_ID);


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
