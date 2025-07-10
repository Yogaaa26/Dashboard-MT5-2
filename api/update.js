// /api/update.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ✅ Inisialisasi Firebase (ambil dari environment variables)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;

    if (!data || !data.id) {
      return res.status(400).json({ message: "Missing id in request body" });
    }

    // ⚡ Buat dokumen di koleksi "accounts" dengan ID unik
    await setDoc(doc(db, "accounts", data.id), data, { merge: true });

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating Firestore:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
