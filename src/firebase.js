// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdaA-CsdyY1fblY8j3082_pUk2hCivJBA",
  authDomain: "dashboard-mt.firebaseapp.com",
  databaseURL: "https://dashboard-mt-default-rtdb.firebaseio.com",
  projectId: "dashboard-mt",
  storageBucket: "dashboard-mt.firebasestorage.app",
  messagingSenderId: "343827230016",
  appId: "1:343827230016:web:bb25bfb07daa696f8ddea5",
  measurementId: "G-WEDLNJ21EH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);