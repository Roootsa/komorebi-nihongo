import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB1geB3gQw73_eH4d5_F8H9ltH23dIUoAA",
  authDomain: "komorebi-nihongo.firebaseapp.com",
  projectId: "komorebi-nihongo",
  storageBucket: "komorebi-nihongo.firebasestorage.app",
  messagingSenderId: "89245778523",
  appId: "1:89245778523:web:6b7968659dd3c909e0757e",
  measurementId: "G-G8CCQ3JBG2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);