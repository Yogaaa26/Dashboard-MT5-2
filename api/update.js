import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { accountsData, commandQueue } from '../shared/state.js';

// Inisialisasi Firebase satu kali
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', async () => {
      rawBody = rawBody.toString('utf-8').replace(/\0/g, '').trim();
      try {
        const data = JSON.parse(rawBody);
        const accountId = data.accountId;
        if (!accountId) return res.status(400).json({ error: 'accountId dibutuhkan' });

        accountsData[accountId] = { ...accountsData[accountId], ...data };
        await setDoc(doc(db, 'accounts', accountId), accountsData[accountId], { merge: true });

        const command = commandQueue[accountId];
        if (command) {
          delete commandQueue[accountId];
          return res.status(200).json(command);
        } else {
          return res.status(200).json({ status: 'ok', command: 'none' });
        }
      } catch (e) {
        console.error(e);
        return res.status(400).json({ error: 'Format JSON tidak valid' });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
