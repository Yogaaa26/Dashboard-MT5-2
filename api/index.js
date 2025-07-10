// /api/index.js
// Kode ini diadaptasi untuk berjalan di lingkungan Vercel Serverless

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Mengizinkan request dari domain lain (penting untuk Vercel)

// Variabel untuk menyimpan data di memori (akan direset jika serverless function tidur)
let accountsData = {};
let commandQueue = {};

/**
 * Rute untuk menerima update dari Expert Advisor (EA) di MetaTrader.
 * Menggunakan parser mentah karena EA mungkin mengirim data dengan karakter null.
 */
app.post('/api/update', express.raw({ type: '*/*' }), (req, res) => {
    // Membersihkan karakter null (\0) dari body request
    const rawBody = req.body.toString('utf-8').replace(/\0/g, '').trim();

    try {
        const data = JSON.parse(rawBody);
        const accountId = data.accountId;

        if (!accountId) {
            console.error("Update gagal: accountId tidak ditemukan di body request.");
            return res.status(400).send({ error: 'accountId dibutuhkan dari EA' });
        }

        // Memperbarui data akun
        accountsData[accountId] = { ...accountsData[accountId], ...data };
        console.log(`Update BERHASIL dari Akun: ${accountId}`);

        // Memeriksa apakah ada perintah yang menunggu untuk akun ini
        const command = commandQueue[accountId];
        if (command) {
            res.json(command); // Mengirim perintah ke EA
            delete commandQueue[accountId]; // Menghapus perintah setelah dikirim
        } else {
            res.json({ status: 'ok', command: 'none' }); // Tidak ada perintah
        }
    } catch (error) {
        console.error("Gagal mem-parsing JSON dari EA:", error.message);
        console.error("Laporan Mentah yang Gagal:", rawBody);
        res.status(400).send({ error: 'Format JSON tidak valid dari EA.' });
    }
});

/**
 * Rute untuk frontend (React App) untuk mengambil semua data akun.
 */
app.get('/api/accounts', (req, res) => {
    res.json(accountsData);
});

/**
 * Rute untuk menerima perintah toggle robot dari dasbor frontend.
 * Menggunakan parser JSON standar.
 */
app.post('/api/robot-toggle', express.json(), (req, res) => {
    const { accountId, newStatus } = req.body;
    if (!accountId || !newStatus) {
        return res.status(400).send({ error: 'accountId dan newStatus dibutuhkan' });
    }
    // Menyimpan perintah dalam antrian
    commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
    console.log(`Perintah untuk Akun ${accountId}: Robot ${newStatus}`);
    res.json({ message: `Perintah untuk Akun ${accountId} dicatat.` });
});

// PENTING: Ekspor aplikasi 'app' agar Vercel dapat menggunakannya.
// Vercel akan menangani proses 'listening' secara otomatis.
module.exports = app;
