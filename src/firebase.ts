import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4mMH0LMAvN_vuCLCdYR3tGZHdmbq7iMM",
  authDomain: "primeastra-643ac.firebaseapp.com",
  projectId: "primeastra-643ac",
  storageBucket: "primeastra-643ac.firebasestorage.app",
  messagingSenderId: "756871848434",
  appId: "1:756871848434:web:07c5220d2a84a026190b6b",
  measurementId: "G-R8H0S5LW8N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);