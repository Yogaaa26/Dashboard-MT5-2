import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, List, Clock, Search, X, CheckCircle, Bell, ArrowLeft, History, Activity, Check, Power } from 'lucide-react';

// URL backend
const API_URL = "https://pond-rounded-lute.glitch.me";

// Format currency helper
const formatCurrency = (value, includeSign = true) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : (includeSign ? '+' : '');
  return `${sign}$${absValue.toFixed(2)}`;
};

// Hitung profit/loss
const calculatePL = (account) => {
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
  if (account.status !== 'active' || isPending) return 0;
  return parseFloat(account.profit) || 0;
};

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState('dashboard');

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Notifikasi
  const addNotification = (title, message, type) => {
    setNotifications(prev => [{ id: Date.now(), title, message, type }, ...prev].slice(0, 5));
  };
  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Fetch data akun
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/accounts`);
        const data = await res.json();
        if (data && typeof data === 'object') setAccounts(Object.values(data));
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data history (opsional)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/history`);
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (err) {
        console.error("Gagal fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  // Toggle robot
  const handleToggleRobot = async (accountId, newStatus) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, robotStatus: newStatus } : acc));
    try {
      await fetch(`${API_URL}/api/robot-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, newStatus })
      });
    } catch (err) {
      console.error("Gagal toggle robot:", err);
      addNotification('Error', 'Gagal mengirim perintah ke server.', 'take_profit_loss');
      // rollback
      setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, robotStatus: newStatus === 'on' ? 'off' : 'on' } : acc));
    }
  };

  // Drag & drop
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDragging(true);
  };
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = async () => {
    if (dragOverItem.current === null) { setDragging(false); return; }
    const newList = [...accounts];
    const item = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, item);
    setAccounts(newList);
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(false);
    // opsional: kirim ke backend
    try {
      await fetch(`${API_URL}/api/update-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder: newList.map(a => a.id) })
      });
    } catch (err) {
      console.error("Gagal update order:", err);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard MetaTrader</h1>
            <p className="text-slate-400 mt-1">
              {page === 'dashboard' ? 'Ringkasan global dan status akun individual.' : 'Riwayat transaksi 1 minggu terakhir.'}
            </p>
          </div>
          {page === 'dashboard' ? (
            <button onClick={() => setPage('history')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
              <History size={20} /><span>Lihat Riwayat</span>
            </button>
          ) : (
            <button onClick={() => setPage('dashboard')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
              <ArrowLeft size={20} /><span>Kembali ke Dashboard</span>
            </button>
          )}
        </header>

        <main>
          {page === 'dashboard' ? (
            <>
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Cari nama akun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {accounts.filter(a => a.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((account, index) => (
                  <div
                    key={account.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4 transition-all duration-200 cursor-grab
                      ${dragging && dragItem.current === index ? 'opacity-50 ring-2 ring-blue-500' : 'opacity-100'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold">{account.accountName}</h3>
                      <button onClick={() => handleToggleRobot(account.id, account.robotStatus === 'on' ? 'off' : 'on')}>
                        <Power size={18} className={account.robotStatus === 'on' ? 'text-green-500' : 'text-slate-500'} />
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm">{account.pair}</p>
                    <p className="text-slate-400 text-sm">Lot: {account.lotSize}</p>
                    <p className="text-slate-400 text-sm">P/L: {formatCurrency(calculatePL(account))}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-slate-400">[History view sederhana, bisa kamu lengkapi]</div>
          )}
        </main>
      </div>
    </div>
  );
}
