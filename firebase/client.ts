
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyA_FViK5SrjwcuIUCYQ4jfVqQ67rQa3SQU",
  authDomain: "that-s-me-21f32.firebaseapp.com",
  projectId: "that-s-me-21f32",
  storageBucket: "that-s-me-21f32.firebasestorage.app",
  messagingSenderId: "424244619023",
  appId: "1:424244619023:web:148938b37aae8fd3a7407a",
  measurementId: "G-CRGZR6FRGW"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);