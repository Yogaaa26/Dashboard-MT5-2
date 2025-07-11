// pages/api/update.js
import { db } from "./firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk });
    req.on('end', async () => {
      try {
        rawBody = rawBody.toString('utf-8').replace(/\0/g, '').trim();
        const data = JSON.parse(rawBody);

        if (!data.accountId) {
          return res.status(400).json({ message: "Missing accountId in request body" });
        }

        await db.ref(`accounts/${data.accountId}`).set(data);
        console.log(`✅ Data akun ${data.accountId} berhasil disimpan ke Firebase`);

        res.status(200).json({ message: "Data updated successfully" });
      } catch (error) {
        console.error('❌ Error parsing JSON or saving:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    res.status(500).json({ message: "Unexpected server error", error: error.message });
  }
}
