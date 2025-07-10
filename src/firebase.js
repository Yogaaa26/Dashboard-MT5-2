// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCdaA-CsdyY1fblY8j3082_pUk2hCivJBA",
  authDomain: "dashboard-mt.firebaseapp.com",
  projectId: "dashboard-mt",
  storageBucket: "dashboard-mt.firebasestorage.app",
  messagingSenderId: "343827230016",
  appId: "1:343827230016:web:bb25bfb07daa696f8ddea5",
  measurementId: "G-WEDLNJ21EH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export db supaya bisa dipakai di App.js
export { db };
