// server.js (Versi Final)
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); 

let accountsData = {};
let commandQueue = {};

// Rute untuk menerima update dari EA (menggunakan parser mentah)
app.post('/api/update', express.raw({ type: '/' }), (req, res) => {
    // Membersihkan karakter "hantu" (null characters) dari laporan EA
    const rawBody = req.body.toString('utf-8').replace(/\0/g, '').trim();

    try {
        const data = JSON.parse(rawBody);
        const accountId = data.accountId;

        if (!accountId) {
            return res.status(400).send({ error: 'accountId dibutuhkan dari EA' });
        }
        accountsData[accountId] = { ...accountsData[accountId], ...data };
        console.log(Update BERHASIL dari Akun: ${accountId});

        const command = commandQueue[accountId];
        if (command) {
            res.json(command);
            delete commandQueue[accountId];
        } else {
            res.json({ status: 'ok', command: 'none' });
        }
    } catch (error) {
        console.error("Gagal mem-parsing JSON dari EA:", error.message);
        console.error("Laporan Mentah yang Gagal:", rawBody);
        res.status(400).send({ error: 'Format JSON tidak valid dari EA.' });
    }
});

app.get('/api/accounts', (req, res) => {
    res.json(accountsData);
});

// Rute untuk menerima perintah dari dasbor (menggunakan parser JSON standar)
app.post('/api/robot-toggle', express.json(), (req, res) => {
    const { accountId, newStatus } = req.body;
    if (!accountId || !newStatus) {
        return res.status(400).send({ error: 'accountId dan newStatus dibutuhkan' });
    }
    commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
    console.log(Perintah untuk Akun ${accountId}: Robot ${newStatus});
    res.json({ message: Perintah untuk Akun ${accountId} dicatat. });
});

// Mengirim file index.html untuk semua halaman
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(Server berjalan di port ${PORT});
});