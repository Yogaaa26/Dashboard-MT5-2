// pages/api/robot-toggle.js
import { db } from "./firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { accountId, active } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Missing accountId" });
    }

    await db.ref(`accounts/${accountId}/robotActive`).set(active);
    res.status(200).json({ message: "Robot status updated" });
  } catch (error) {
    console.error("Error updating robot status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
