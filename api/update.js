<<<<<<< HEAD
// /api/update.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ✅ Inisialisasi Firebase (ambil dari environment variables)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
=======
import { accountsData, commandQueue } from '../shared/state.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
<<<<<<< HEAD
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
=======
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export default async function handler(req, res) {
  if (req.method === 'POST') {
    let rawBody = '';
    req.on('data', chunk => rawBody += chunk);
    req.on('end', async () => {
      try {
        rawBody = rawBody.toString('utf-8').replace(/\0/g, '').trim();
        const data = JSON.parse(rawBody);
        const accountId = data.accountId;
        if (!accountId) {
          return res.status(400).json({ error: 'accountId dibutuhkan' });
        }
        accountsData[accountId] = { ...accountsData[accountId], ...data };
        console.log(`✅ Update BERHASIL dari Akun: ${accountId}`);
        try {
          await setDoc(doc(db, 'accounts', accountId), accountsData[accountId], { merge: true });
          console.log(`📦 Data akun ${accountId} berhasil disimpan ke Firestore`);
        } catch (error) {
          console.error('❌ Gagal simpan ke Firestore:', error);
        }
        const command = commandQueue[accountId];
        if (command) {
          delete commandQueue[accountId];
          res.status(200).json(command);
        } else {
          res.status(200).json({ status: 'ok', command: 'none' });
        }
      } catch (error) {
        console.error('❌ Gagal parsing JSON:', error);
        res.status(400).json({ error: 'Format JSON tidak valid' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
