import { commandQueue } from '../shared/state.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const { accountId, newStatus } = body;

    if (!accountId || !newStatus) {
      return res.status(400).json({ error: 'accountId dan newStatus dibutuhkan' });
    }

    commandQueue[accountId] = { command: 'toggle_robot', status: newStatus };
    res.status(200).json({ message: `Perintah untuk Akun ${accountId} dicatat.` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
