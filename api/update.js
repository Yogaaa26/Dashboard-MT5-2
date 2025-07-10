import { accountsData, commandQueue } from '../shared/state.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
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