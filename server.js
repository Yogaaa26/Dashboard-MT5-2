// server.js (Versi Lengkap dengan Firestore)
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Firebase SDK v9 (modular) - diimport lewat CommonJS
const { initializeApp } = require('firebase/app');
const { getFirestore, setDoc, doc } = require('firebase/firestore');

// 🔑 GANTI DENGAN KONFIGURASI FIREBASE KAMU
const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx"
};

// Inisialisasi Firebase & Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(cors());
app.use(express.static('public'));

let accountsData = {};
let commandQueue = {};

// Rute menerima update dari EA
app.post('/api/update', express.raw({ type: '/' }), async (req, res) => {
  const rawBody = req.body.toString('utf-8').replace(/\0/g, '').trim();

  try {
    const data = JSON.parse(rawBody);
    const accountId = data.accountId;

    if (!accountId) {
      return res.status(400).send({ error: 'accountId dibutuhkan dari EA' });
    }

    accountsData[accountId] = { ...accountsData[accountId], ...data };
    console.log(`✅ Update BERHASIL dari Akun: ${accountId}`);

    // 🔥 Simpan ke Firestore
    try {
      await setDoc(doc(db, 'accounts', accountId), accountsData[accountId], { merge: true });
      console.log(`📦 Data akun ${accountId} berhasil disimpan ke Firestore`);
    } catch (error) {
      console.error(`❌ Gagal simpan ke Firestore:`, error);
    }

    // Kirim command jika ada
    const command = commandQueue[accountId];
    if (command) {
      res.json(command);
      delete commandQueue[accountId];
    } else {
      res.json({ status: 'ok', command: 'none' });
    }

  } catch (error) {
    console.error("❌ Gagal parsing JSON dari EA:", error.message);
    console.error("⚠ Laporan Mentah yang Gagal:", rawBody);
    res.status(400).send({ error: 'Format JSON tidak valid dari EA.' });
  }
});

// Endpoint untuk dashboard ambil semua akun
app.get('/api/accounts', (req, res) => {
  res.json(accountsData);
});

// Endpoint toggle robot
app.post('/api/robot-toggle', express.json(), (req, res) => {
  const { accountId, newStatus } = req.body;
  if (!accountId || !newStatus) {
    return res.status(400).send({ error: 'accountId dan newStatus dibutuhkan' });
  }

  commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
  console.log(`⚙️ Perintah untuk Akun ${accountId}: Robot ${newStatus}`);
  res.json({ message: `Perintah untuk Akun ${accountId} dicatat.` });
});

// Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});