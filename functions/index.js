// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Function untuk simpan data trading ke Firestore
exports.saveTradingData = functions.https.onRequest(async (req, res) => {
    try {
        // Data dikirim dari EA atau backend lain
        const data = req.body;

        // Simpan ke Firestore (collection: 'accounts')
        await db.collection('accounts').add(data);

        res.status(200).send('Data berhasil disimpan!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan.');
    }
});
