import { accountsData } from '../shared/state.js';
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(accountsData);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}