// import dll...
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, History, ArrowLeft, Power, Activity, Check } from 'lucide-react';

// URL API
const API_URL = "https://pond-rounded-lute.glitch.me"; 

// Helper: format currency dengan 2 decimal
const formatCurrency = (value, includeSign = true) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : (includeSign ? '+' : '');
  return `${sign}$${absValue.toFixed(2)}`;
};

// Helper: hitung profit/loss
const calculatePL = (account) => {
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
  if (account.status !== 'active' || isPending) return 0;
  const priceDiff = account.currentPrice - account.entryPrice;
  const multiplier = account.pair.includes('JPY') ? 100 : 100000;
  if (account.executionType === 'buy') return priceDiff * account.lotSize * multiplier;
  if (account.executionType === 'sell') return -priceDiff * account.lotSize * multiplier;
  return 0;
};

// Komponen utama
export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState('dashboard');

  // Ambil data dari server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/accounts`);
        const data = await res.json();
        if (data && typeof data === 'object') {
          setAccounts(Object.values(data));
        }
      } catch (e) {
        console.error("Gagal fetch:", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ handleToggleRobot masih versi default polos
  const handleToggleRobot = async (accountId, newStatus) => {
    try {
      await fetch(`${API_URL}/api/robot-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, newStatus })
      });
    } catch (error) {
      console.error("Gagal mengirim perintah ke server:", error);
    }
  };

  // UI Ringkasan (Summary)
  const summary = useMemo(() => {
    const active = accounts.filter(a => a.status === 'active');
    const profits = active.map(calculatePL);
    return {
      totalAccounts: accounts.length,
      activeCount: active.length,
      profitable: profits.filter(pl => pl > 0).length,
      losing: profits.filter(pl => pl < 0).length,
      pending: active.filter(a => a.executionType.includes('limit') || a.executionType.includes('stop')).length,
      totalPL: profits.reduce((a, b) => a + b, 0)
    };
  }, [accounts]);

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <header className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard MetaTrader</h1>
        {page === 'dashboard' ? (
          <button onClick={() => setPage('history')} className="bg-blue-600 px-4 py-2 rounded">History</button>
        ) : (
          <button onClick={() => setPage('dashboard')} className="bg-slate-700 px-4 py-2 rounded">← Back</button>
        )}
      </header>

      {page === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>Total Akun: {summary.totalAccounts}</div>
            <div>Akun Aktif: {summary.activeCount}</div>
            <div>Floating Profit: {summary.profitable}</div>
            <div>Floating Minus: {summary.losing}</div>
            <div>Order Pending: {summary.pending}</div>
            <div>Total P/L: {formatCurrency(summary.totalPL, false)}</div>
          </div>

          <input
            type="text"
            placeholder="Cari akun..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-3 py-2 rounded bg-slate-800"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts
              .filter(a => a.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((acc) => {
                const pl = calculatePL(acc);
                return (
                  <div key={acc.id} className="p-4 bg-slate-800 rounded">
                    <div className="flex justify-between">
                      <div>{acc.accountName}</div>
                      <button onClick={() => handleToggleRobot(acc.id, acc.robotStatus === 'on' ? 'off' : 'on')}>
                        <Power size={18} className={acc.robotStatus === 'on' ? 'text-green-500' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-sm mt-2">
                      Pair: {acc.pair} <br />
                      Lot: {acc.lotSize.toFixed(2)} <br />
                      Harga Masuk: {acc.entryPrice.toFixed(3)} <br />
                      Harga Sekarang: {acc.currentPrice.toFixed(3)} <br />
                      Profit/Loss: <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatCurrency(pl)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {page === 'history' && (
        <div>Riwayat akan ditampilkan di sini</div>
      )}
    </div>
  );
}
