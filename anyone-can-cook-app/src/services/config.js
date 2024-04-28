// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqIkqUvYgHRsdRbrMpoOwNGr2N9dXomKQ",
  authDomain: "food-expo-app.firebaseapp.com",
  projectId: "food-expo-app",
  storageBucket: "food-expo-app.appspot.com",
  messagingSenderId: "565470612127",
  appId: "1:565470612127:web:0be852bcbc1d6bffae70aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = getAuth(app)

export { db, app, auth };