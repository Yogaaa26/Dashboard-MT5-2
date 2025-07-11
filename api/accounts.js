// pages/api/accounts.js
import { db } from "./firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const snapshot = await db.ref('accounts').once('value');
    const data = snapshot.val() || {};
    res.status(200).json({ accounts: data });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
