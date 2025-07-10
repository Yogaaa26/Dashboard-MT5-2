const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Function untuk menerima POST dari EA dan simpan data akun ke Firestore
exports.addAccount = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const data = req.body;

    // Pastikan data punya ID
    if (!data.id) {
      return res.status(400).send("Missing account ID");
    }

    await db.collection("accounts").doc(data.id).set(data, { merge: true });

    return res.status(200).send("Account data saved successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
