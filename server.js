<<<<<<< HEAD
// server.js

// Memanggil "staf" yang sudah kita install
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; // Port tempat server akan berjalan

// Middleware untuk mengizinkan server menerima data JSON dan diakses dari alamat lain
app.use(cors());
app.use(express.json());

// --- DATABASE SEMENTARA ---
// Kita gunakan objek sederhana untuk menyimpan data, seolah-olah ini adalah buku catatan Manajer Operasional.
let accountsData = {}; // Untuk menyimpan data terbaru dari semua akun
let commandQueue = {}; // Untuk menyimpan perintah yang akan diambil oleh EA

// --- RUTE API (JALUR KOMUNIKASI) ---

// 1. Jalur untuk Asisten Cabang (EA) melapor
// Alamat: POST http://alamat-server-anda/api/update
app.post('/api/update', (req, res) => {
    const data = req.body;
    const accountId = data.accountId;

    if (!accountId) {
        return res.status(400).send({ error: 'Nomor Akun (accountId) dibutuhkan' });
    }

    // Menyimpan atau memperbarui data ke "buku catatan" kita
    accountsData[accountId] = { ...accountsData[accountId], ...data };
    console.log(`Menerima update dari Akun: ${accountId}`);
    
    // Mengirim kembali perintah yang mungkin ada untuk akun ini
    const command = commandQueue[accountId];
    if (command) {
        res.json(command); // Kirim perintah ke EA
        delete commandQueue[accountId]; // Hapus perintah setelah dikirim
    } else {
        res.json({ status: 'ok', command: 'none' }); // Tidak ada perintah
    }
});

// 2. Jalur untuk Ruang Kontrol (Dasbor) melihat semua data
// Alamat: GET http://alamat-server-anda/api/accounts
app.get('/api/accounts', (req, res) => {
    res.json(Object.values(accountsData)); // Mengirim semua data yang tersimpan
});

// 3. Jalur untuk Ruang Kontrol (Dasbor) memberi perintah
// Alamat: POST http://alamat-server-anda/api/robot-toggle
app.post('/api/robot-toggle', (req, res) => {
    const { accountId, newStatus } = req.body;

    if (!accountId || !newStatus) {
        return res.status(400).send({ error: 'Nomor Akun (accountId) dan Status Baru dibutuhkan' });
    }

    // Menyimpan perintah di "buku catatan perintah"
    commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
    console.log(`Perintah diterima untuk Akun ${accountId}: Set Robot ke ${newStatus}`);
    res.json({ message: `Perintah untuk Akun ${accountId} telah dicatat.` });
});


// Menyalakan server
app.listen(PORT, () => {
    console.log(`Server Manajer Operasional berjalan di port ${PORT}`);
});
=======
// server.js (Final untuk Vercel)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Firebase SDK modular
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const app = express();

// Konversi __dirname (karena pakai ES Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config via env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inisialisasi Firebase
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

    try {
      await setDoc(doc(db, 'accounts', accountId), accountsData[accountId], { merge: true });
      console.log(`📦 Data akun ${accountId} berhasil disimpan ke Firestore`);
    } catch (error) {
      console.error(`❌ Gagal simpan ke Firestore:`, error);
    }

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

// Endpoint ambil data akun
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

// ✅ Di Vercel, export app sebagai default
export default app;
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
