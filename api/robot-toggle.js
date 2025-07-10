// api/robot-toggle.js
import { commandQueue } from '../shared/state.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { accountId, newStatus } = req.body;
    if (!accountId || !newStatus) {
      return res.status(400).json({ error: 'accountId dan newStatus dibutuhkan' });
    }
    commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
    console.log(`⚙️ Perintah untuk Akun ${accountId}: Robot ${newStatus}`);
    res.status(200).json({ message: `Perintah untuk Akun ${accountId} dicatat.` });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
