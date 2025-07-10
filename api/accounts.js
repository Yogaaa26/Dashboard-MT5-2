import { accountsData } from '../shared/state.js';

export default function handler(req, res) {
  res.status(200).json(accountsData);
}
