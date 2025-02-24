// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRNOCG08sI8viIA2jaJDtP2zUAzNDwl0Y",
  authDomain: "smkwakatobiku.firebaseapp.com",
  databaseURL: "https://smkwakatobiku-default-rtdb.firebaseio.com",
  projectId: "smkwakatobiku",
  storageBucket: "smkwakatobiku.firebasestorage.app",
  messagingSenderId: "681363262246",
  appId: "1:681363262246:web:523df8256b4659e7870fe7",
  measurementId: "G-X8F3C5YHMW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
