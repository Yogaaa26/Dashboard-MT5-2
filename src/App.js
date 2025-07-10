import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Briefcase, TrendingUp, TrendingDown, DollarSign, List, Clock, Search, X, CheckCircle, Bell,
  ArrowLeft, History, Activity, Check, Power
} from 'lucide-react';

const API_URL = "https://dashboard-mt-5.vercel.app";
const LOCAL_STORAGE_KEY = 'accountOrder';

// Helper function
const formatCurrency = (value, includeSign = true) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : (includeSign ? '+' : '');
  return `${sign}$${absValue.toFixed(2)}`;
};

// Hitung profit/loss
const calculatePL = (account) => {
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
  if (account.status !== 'active' || isPending) return 0;
  const priceDiff = account.currentPrice - account.entryPrice;
  const multiplier = account.pair.includes('JPY') ? 100 : 100000;
  if (account.executionType === 'buy') return priceDiff * account.lotSize * multiplier;
  if (account.executionType === 'sell') return -priceDiff * account.lotSize * multiplier;
  return 0;
};

// Komponen notifikasi
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);
  const Icon = notification.type === 'take_profit_profit' ? CheckCircle :
               notification.type === 'take_profit_loss' ? X : Bell;
  const color = notification.type === 'take_profit_profit' ? 'text-green-400' :
                notification.type === 'take_profit_loss' ? 'text-red-400' : 'text-blue-400';
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 flex items-start space-x-3 animate-fade-in-up">
      <Icon className={`${color} mt-1 flex-shrink-0`} size={20} />
      <div className="flex-1">
        <p className="text-sm text-white font-semibold">{notification.title}</p>
        <p className="text-xs text-slate-300">{notification.message}</p>
      </div>
      <button onClick={() => onClose(notification.id)} className="text-slate-500 hover:text-white">
        <X size={18} />
      </button>
    </div>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => (
  <div className="fixed bottom-4 right-4 z-50 w-80 space-y-3">
    {notifications.map(n => (
      <Notification key={n.id} notification={n} onClose={removeNotification} />
    ))}
  </div>
);

// Komponen ringkasan dashboard
const SummaryDashboard = ({ accounts }) => {
  const summary = useMemo(() => {
    const active = accounts.filter(acc => acc.status === 'active');
    const pls = active.map(calculatePL);
    const profitable = pls.filter(pl => pl > 0).length;
    const losing = pls.filter(pl => pl < 0).length;
    const totalPL = pls.reduce((a, b) => a + b, 0);
    const pending = active.filter(acc => acc.executionType.includes('limit') || acc.executionType.includes('stop')).length;
    return { total: accounts.length, active: active.length, profitable, losing, pending, totalPL };
  }, [accounts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <SummaryStat icon={<Briefcase size={24} className="text-blue-400" />} title="Total Akun" value={summary.total} />
      <SummaryStat icon={<List size={24} className="text-cyan-400" />} title="Akun Aktif" value={summary.active} />
      <SummaryStat icon={<TrendingUp size={24} className="text-green-400" />} title="Floating Profit" value={summary.profitable} colorClass="text-green-500" />
      <SummaryStat icon={<TrendingDown size={24} className="text-red-400" />} title="Floating Minus" value={summary.losing} colorClass="text-red-500" />
      <SummaryStat icon={<Clock size={24} className="text-yellow-400" />} title="Order Pending" value={summary.pending} colorClass="text-yellow-500" />
      <SummaryStat icon={<DollarSign size={24} className={summary.totalPL >= 0 ? 'text-green-400' : 'text-red-400'} />} title="Total Profit/Loss" value={formatCurrency(summary.totalPL, false)} colorClass={summary.totalPL >= 0 ? 'text-green-500' : 'text-red-500'} />
    </div>
  );
};

const SummaryStat = ({ icon, title, value, colorClass = 'text-white' }) => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 border border-slate-700">
    <div className="bg-slate-900 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

// Komponen kartu akun
const AccountCard = ({ account, onToggleRobot, handleDragStart, handleDragEnter, handleDragEnd, index, isDragging }) => {
  const profitLoss = useMemo(() => calculatePL(account), [account]);
  const isProfitable = profitLoss > 0;
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
  const borderColor = account.status !== 'active' ? 'border-slate-600' : isPending ? 'border-yellow-500' : isProfitable ? 'border-green-500' : 'border-red-500';
  return (
    <div className={`bg-slate-800 rounded-lg shadow-xl border ${borderColor} flex flex-col transition-all cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd}>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white">{account.accountName}</h3>
            <button onClick={(e) => { e.stopPropagation(); onToggleRobot(account.id, account.robotStatus === 'on' ? 'off' : 'on'); }}
              title={`Robot ${account.robotStatus === 'on' ? 'ON' : 'OFF'}`} className="p-1 rounded-full hover:bg-slate-700">
              <Power size={18} className={account.robotStatus === 'on' ? 'text-green-500' : 'text-slate-500'} />
            </button>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500 text-white">{account.executionType.replace('_', ' ').toUpperCase()}</span>
        </div>
        {/* Tambahkan detail akun seperti pair, lot, price, profitLoss */}
      </div>
    </div>
  );
};

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const dragItem = useRef(null); const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addNotification = (title, message, type) => setNotifications(prev => [{ id: Date.now(), title, message, type }, ...prev].slice(0, 5));
  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/accounts`);
        const data = await response.json();
        if (data) {
          const serverAccounts = Object.values(data);
          const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
          const map = new Map(serverAccounts.map(acc => [acc.id, acc]));
          const ordered = saved.map(id => map.get(id)).filter(Boolean);
          const rest = serverAccounts.filter(acc => !saved.includes(acc.id));
          setAccounts([...ordered, ...rest]);
        }
      } catch (err) { console.error(err); }
    };
    fetchData(); const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e, pos) => { dragItem.current = pos; setDragging(true); };
  const handleDragEnter = (e, pos) => { dragOverItem.current = pos; };
  const handleDragEnd = () => {
    if (dragOverItem.current === null || dragItem.current === dragOverItem.current) { setDragging(false); return; }
    const copy = [...accounts]; const item = copy[dragItem.current];
    copy.splice(dragItem.current, 1); copy.splice(dragOverItem.current, 0, item);
    setAccounts(copy);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(copy.map(acc => acc.id)));
    dragItem.current = null; dragOverItem.current = null; setDragging(false);
  };

  const handleToggleRobot = async (accountId, newStatus) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, robotStatus: newStatus } : acc));
    try {
      await fetch(`${API_URL}/api/robot-toggle`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId, newStatus }) });
    } catch (e) {
      console.error(e);
      addNotification('Error', 'Gagal update robot', 'take_profit_loss');
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        placeholder="Cari nama akun..." className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 mb-4" />
      <SummaryDashboard accounts={accounts} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {accounts.filter(a => a.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((acc, i) => (
            <AccountCard key={acc.id} account={acc} onToggleRobot={handleToggleRobot}
              handleDragStart={handleDragStart} handleDragEnter={handleDragEnter}
              handleDragEnd={handleDragEnd} index={i} isDragging={dragging && dragItem.current === i} />
          ))}
      </div>
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </div>
  );
}
