import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // pastikan path sesuai

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "accounts"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(list);
    });
    return () => unsub();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">🔥 Data Dari Firestore</h2>
      {accounts.length === 0 ? (
        <p className="text-slate-400">Belum ada data akun di Firestore.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map(account => (
            <li key={account.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <p>Nama: {account.accountName || 'N/A'}</p>
              <p>Balance: {account.balance || 0}</p>
              <p>Equity: {account.equity || 0}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
