import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, List, Clock, Search, X, CheckCircle, Bell, ArrowLeft, History, Activity, Check, Power } from 'lucide-react';
<<<<<<< HEAD

// --- KONFIGURASI PENTING ---
// Ganti alamat URL ini dengan alamat server backend Anda dari Glitch nanti
const API_URL = "https://dashboard-mt-5.vercel.app"; 

// Helper function to format currency
=======
import AccountList from './components/AccountList'; 

const API_URL = "https://pond-rounded-lute.glitch.me"; 
const LOCAL_STORAGE_KEY = 'accountOrder';

>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
const formatCurrency = (value, includeSign = true) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : (includeSign ? '+' : '');
  return `${sign}$${absValue.toFixed(2)}`;
};

<<<<<<< HEAD
// --- Shared Logic ---
const calculatePL = (account) => {
    const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
    if (account.status !== 'active' || isPending) {
        return 0;
    }
    const priceDiff = account.currentPrice - account.entryPrice;
    const multiplier = account.pair.includes('JPY') ? 100 : 100000;
    if (account.executionType === 'buy') {
        return priceDiff * account.lotSize * multiplier;
    } else if (account.executionType === 'sell') {
        return -priceDiff * account.lotSize * multiplier;
    }
    return 0;
};

// Helper function to generate random mock data for accounts
const generateMockData = (count) => {
  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'XAU/USD', 'BTC/USD'];
  const types = ['buy', 'sell', 'buy_limit', 'sell_limit', 'buy_stop', 'sell_stop'];
  const accounts = [];
  for (let i = 1; i <= count; i++) {
    const isActive = Math.random() > 0.3; 
    const basePrice = 1 + Math.random() * 0.2; 
    accounts.push({
      id: i,
      accountName: `Akun ${String(i).padStart(3, '0')}`,
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      lotSize: parseFloat((Math.random() * 1.5 + 0.01).toFixed(2)),
      executionType: isActive ? types[Math.floor(Math.random() * types.length)] : 'none',
      entryPrice: isActive ? parseFloat(basePrice.toFixed(5)) : 0,
      currentPrice: isActive ? parseFloat((basePrice + (Math.random() - 0.5) * 0.01).toFixed(5)) : 0,
      status: isActive ? 'active' : 'inactive',
      robotStatus: Math.random() > 0.5 ? 'on' : 'off',
    });
  }
  return accounts;
};

// Helper function to generate mock history data for demonstration
const generateMockHistory = () => {
    const mockHistory = [];
    let today = new Date();
    mockHistory.push({ id: 1001, accountName: 'Akun 015', pair: 'XAU/USD', lotSize: 0.50, executionType: 'buy', pl: 250.75, closeDate: new Date(new Date().setDate(today.getDate() - 1)).toISOString() });
    mockHistory.push({ id: 1002, accountName: 'Akun 042', pair: 'EUR/USD', lotSize: 1.20, executionType: 'sell', pl: -120.40, closeDate: new Date(new Date().setDate(today.getDate() - 2)).toISOString() });
    return mockHistory;
};


// --- React Components ---

=======
const calculatePL = (account) => {
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');
  if (account.status !== 'active' || isPending) return 0;
  return parseFloat(account.profit) || 0;
};

>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const isProfit = notification.type === 'take_profit_profit';
  const isLoss = notification.type === 'take_profit_loss';
  const Icon = isProfit ? CheckCircle : (isLoss ? X : Bell);
  const iconColor = isProfit ? 'text-green-400' : (isLoss ? 'text-red-400' : 'text-blue-400');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 flex items-start space-x-3 animate-fade-in-up">
      <Icon className={`${iconColor} mt-1 flex-shrink-0`} size={20} />
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
    {notifications.map(n => <Notification key={n.id} notification={n} onClose={removeNotification} />)}
  </div>
);

const SummaryStat = ({ icon, title, value, colorClass = 'text-white' }) => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 border border-slate-700">
    <div className="bg-slate-900 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
<<<<<<< HEAD
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
=======
      <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
    </div>
  </div>
);

const SummaryDashboard = ({ accounts }) => {
  const summary = useMemo(() => {
    const activeAccounts = accounts.filter(acc => acc.status === 'active');
    const profitsAndLosses = activeAccounts.map(calculatePL);
    const profitableAccounts = profitsAndLosses.filter(pl => pl > 0).length;
    const losingAccounts = profitsAndLosses.filter(pl => pl < 0).length;
    const totalPL = profitsAndLosses.reduce((sum, pl) => sum + pl, 0);
    const pendingOrdersCount = activeAccounts.filter(acc => acc.executionType.includes('limit') || acc.executionType.includes('stop')).length;
    return { totalAccounts: accounts.length, activeAccountsCount: activeAccounts.length, profitableAccounts, losingAccounts, pendingOrdersCount, totalPL };
  }, [accounts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <SummaryStat icon={<Briefcase size={24} className="text-blue-400" />} title="Total Akun" value={summary.totalAccounts} />
      <SummaryStat icon={<List size={24} className="text-cyan-400" />} title="Akun Aktif" value={summary.activeAccountsCount} />
      <SummaryStat icon={<TrendingUp size={24} className="text-green-400" />} title="Floating Profit" value={summary.profitableAccounts} colorClass="text-green-500" />
      <SummaryStat icon={<TrendingDown size={24} className="text-red-400" />} title="Floating Minus" value={summary.losingAccounts} colorClass="text-red-500" />
      <SummaryStat icon={<Clock size={24} className="text-yellow-400" />} title="Order Pending" value={summary.pendingOrdersCount} colorClass="text-yellow-500" />
<<<<<<< HEAD
      <SummaryStat icon={<DollarSign size={24} className={summary.totalPL >= 0 ? 'text-green-400' : 'text-red-400'} />} title="Total Profit/Loss" value={formatCurrency(summary.totalPL, false)} colorClass={summary.totalPL >= 0 ? 'text-green-500' : 'text-red-500'} />
=======
      <SummaryStat icon={<DollarSign size={24} className={summary.totalPL >= 0 ? 'text-green-400' : 'text-red-400'} />} title="Total P/L" value={formatCurrency(summary.totalPL, false)} colorClass={summary.totalPL >= 0 ? 'text-green-500' : 'text-red-500'} />
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
    </div>
  );
};

const AccountCard = ({ account, onToggleRobot, handleDragStart, handleDragEnter, handleDragEnd, index, isDragging }) => {
  const profitLoss = useMemo(() => calculatePL(account), [account]);
  const isProfitable = profitLoss > 0;
  const isPending = account.executionType.includes('limit') || account.executionType.includes('stop');

  const getExecutionTypePill = () => {
    const type = account.executionType;
    let bgColor = 'bg-gray-500', textColor = 'text-white';
    if (type === 'buy_stop' || type === 'buy_limit') { bgColor = 'bg-white'; textColor = 'text-black'; } 
    else if (type === 'sell_stop' || type === 'sell_limit') { bgColor = 'bg-yellow-600'; } 
    else if (type === 'buy') { bgColor = 'bg-blue-600'; } 
    else if (type === 'sell') { bgColor = 'bg-red-600'; }
<<<<<<< HEAD
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>{type.replace('_', ' ').toUpperCase()}</span>;
=======

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
  };

  const getBorderColor = () => {
    if (account.status !== 'active') return 'border-slate-600';
    if (isPending) return 'border-yellow-500';
    return isProfitable ? 'border-green-500' : 'border-red-500';
  };
<<<<<<< HEAD
  
  return (
    <div className={`bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden flex flex-col transition-all duration-300 cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      draggable="true" onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
      <div className={`p-4 border-l-4 ${getBorderColor()} flex-grow`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white">{account.accountName}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag from starting when clicking the button
                onToggleRobot(account.id, account.robotStatus === 'on' ? 'off' : 'on');
              }}
              title={`Robot ${account.robotStatus === 'on' ? 'ON' : 'OFF'}`}
              className="p-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              <Power 
                size={18} 
                className={`${
                  account.robotStatus === 'on' ? 'text-green-500' : 'text-slate-500'
                } transition-colors`}
              />
            </button>
          </div>
          {getExecutionTypePill()}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div className="text-slate-300"><p className="text-slate-500 text-xs">Pair</p><p className="font-semibold">{account.pair}</p></div>
          <div className="text-slate-300"><p className="text-slate-500 text-xs">Lot</p><p className="font-semibold">{account.lotSize.toFixed(2)}</p></div>
          {account.status === 'active' && (
            <div className="text-slate-300 col-span-2 md:col-span-1 md:row-span-2 md:self-center md:text-right">
              {isPending ? (
                <><p className="text-slate-500 text-xs">Status</p><p className="text-xl font-bold text-yellow-500 flex items-center justify-end"><Clock size={18} className="mr-2"/> Pending</p></>
              ) : (
                <><p className="text-slate-500 text-xs">Profit/Loss</p><p className={`text-xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(profitLoss)}</p></>
              )}
            </div>
          )}
          {account.status === 'active' ? (
            <>
              <div className="text-slate-300"><p className="text-slate-500 text-xs">{isPending ? 'Harga Akan Eksekusi' : 'Harga Eksekusi'}</p><p className="font-semibold">{account.entryPrice.toFixed(5)}</p></div>
              <div className="text-slate-300"><p className="text-slate-500 text-xs">Harga Sekarang</p><p className="font-semibold">{account.currentPrice.toFixed(5)}</p></div>
            </>
          ) : ( <div className="col-span-2 md:col-span-3 flex items-center justify-center h-full bg-slate-800/50 rounded-md p-4 my-2"><p className="text-slate-400 italic">Tidak ada order aktif</p></div> )}
        </div>
=======

  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-xl border ${getBorderColor()} overflow-hidden flex flex-col transition-all duration-300 cursor-grab ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}`}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnter={(e) => handleDragEnter(e, index)}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 flex-grow">
        {/* konten kartu yang sudah ada tetap, termasuk tombol toggle robot dan harga */}
        {/* copy paste konten asli kamu di sini */}
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
      </div>
    </div>
  );
};

const DashboardView = ({ accounts, searchTerm, onToggleRobot, handleDragStart, handleDragEnter, handleDragEnd, dragging, dragItem }) => {
<<<<<<< HEAD
    const filteredAccounts = useMemo(() => {
        if (!searchTerm) return accounts;
        return accounts.filter(account => account.accountName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [accounts, searchTerm]);

    return (
        <>
            <SummaryDashboard accounts={accounts} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} onToggleRobot={onToggleRobot} index={accounts.findIndex(a => a.id === account.id)} handleDragStart={handleDragStart} handleDragEnter={handleDragEnter} handleDragEnd={handleDragEnd} isDragging={dragging && dragItem.current === accounts.findIndex(a => a.id === account.id)} />
                ))}
            </div>
        </>
    );
};

const HistoryPage = ({ accounts, history }) => {
    const accountSummary = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return accounts.map(account => {
            const weeklyTrades = history.filter(trade => 
                trade.accountName === account.accountName && new Date(trade.closeDate) > oneWeekAgo
            );

            const totalPL = weeklyTrades.reduce((sum, trade) => sum + trade.pl, 0);
            const totalOrders = weeklyTrades.length;
            const status = account.status === 'active' ? 'Floating' : 'Clear';
            const entryPrice = account.status === 'active' ? account.entryPrice : 0;

            return {
                id: account.id,
                name: account.accountName,
                totalOrders,
                totalPL,
                status,
                entryPrice,
            };
        }).sort((a,b) => a.name.localeCompare(b.name));
    }, [accounts, history]);

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Ringkasan Kinerja Akun (1 Minggu Terakhir)</h2>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Akun</th>
                            <th scope="col" className="px-6 py-3 text-center">Total Order</th>
                            <th scope="col" className="px-6 py-3 text-right">Total Profit/Loss</th>
                            <th scope="col" className="px-6 py-3 text-center">Status Saat Ini</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountSummary.map(summary => (
                            <tr key={summary.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-white">{summary.name}</td>
                                <td className="px-6 py-4 text-center">{summary.totalOrders}</td>
                                <td className={`px-6 py-4 font-semibold text-right ${summary.totalPL > 0 ? 'text-green-500' : summary.totalPL < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                                    {formatCurrency(summary.totalPL)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${summary.status === 'Floating' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {summary.status === 'Floating' ? <Activity className="mr-2" size={14} /> : <Check className="mr-2" size={14} />}
                                        {summary.status === 'Floating' ? `Floating @${summary.entryPrice.toFixed(4)}` : 'Clear'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Main App Component
=======
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    return accounts.filter(account => account.accountName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [accounts, searchTerm]);

  return (
    <>
      <SummaryDashboard accounts={accounts} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account, index) => (
          <AccountCard 
            key={account.id} 
            account={account} 
            onToggleRobot={onToggleRobot} 
            index={accounts.findIndex(a => a.id === account.id)}
            handleDragStart={handleDragStart} 
            handleDragEnter={handleDragEnter} 
            handleDragEnd={handleDragEnd} 
            isDragging={dragging && dragItem.current === accounts.findIndex(a => a.id === account.id)} 
          />
        ))}
      </div>
    </>
  );
};

const HistoryPage = ({ accounts, history }) => {
  const accountSummary = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return accounts.map(account => {
      const weeklyTrades = history.filter(trade =>
        trade.accountName === account.accountName && new Date(trade.closeDate) > oneWeekAgo
      );
      const totalPL = weeklyTrades.reduce((sum, trade) => sum + trade.pl, 0);
      const totalOrders = weeklyTrades.length;
      const status = account.status === 'active' ? 'Floating' : 'Clear';
      const entryPrice = account.status === 'active' ? account.entryPrice : 0;

      return {
        id: account.id,
        name: account.accountName,
        totalOrders,
        totalPL,
        status,
        entryPrice,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [accounts, history]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">Ringkasan Kinerja Akun (1 Minggu Terakhir)</h2>
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
            <tr>
              <th className="px-6 py-3">Nama Akun</th>
              <th className="px-6 py-3 text-center">Total Order</th>
              <th className="px-6 py-3 text-right">Total Profit/Loss</th>
              <th className="px-6 py-3 text-center">Status Saat Ini</th>
            </tr>
          </thead>
          <tbody>
            {accountSummary.map(summary => (
              <tr key={summary.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-white">{summary.name}</td>
                <td className="px-6 py-4 text-center">{summary.totalOrders}</td>
                <td className={`px-6 py-4 font-semibold text-right ${summary.totalPL > 0 ? 'text-green-500' : summary.totalPL < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                  {formatCurrency(summary.totalPL)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${summary.status === 'Floating' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'}`}>
                    {summary.status === 'Floating' ? <Activity className="mr-2" size={14} /> : <Check className="mr-2" size={14} />}
                    {summary.status === 'Floating' ? `Floating @${summary.entryPrice.toFixed(3)}` : 'Clear'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
<<<<<<< HEAD
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState('dashboard');
  
=======
  const [history, setHistory] = useState([]); 
  const [page, setPage] = useState('dashboard');

>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addNotification = (title, message, type) => {
    setNotifications(prev => [{ id: Date.now(), title, message, type }, ...prev].slice(0, 5));
  };
  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

<<<<<<< HEAD
  // Mengambil data dari server
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/accounts`);
      const data = await response.json();
      if (data) {
          setAccounts(Object.values(data)); // Menggunakan data dari server
      }
    } catch (error) {
      console.error("Gagal mengambil data dari server:", error);
      // Biarkan kosong, dasbor akan menunggu data asli
    }
  };

  fetchData(); // Panggil sekali saat komponen dimuat
  const interval = setInterval(fetchData, 5000); // Ambil data setiap 5 detik
  return () => clearInterval(interval);
}, []); // Dependency array kosong agar hanya berjalan sekali saat mount

  const handleToggleRobot = async (accountId, newStatus) => {
    // Optimistic UI update
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === accountId 
          ? { ...account, robotStatus: newStatus }
          : account
      )
    );
    
    try {
        await fetch(`${API_URL}/api/robot-toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId: accountId, newStatus: newStatus })
        });
    } catch (error) {
        console.error("Gagal mengirim perintah ke server:", error);
        // Rollback UI jika gagal
        setAccounts(prevAccounts => 
          prevAccounts.map(account => 
            account.id === accountId 
              ? { ...account, robotStatus: newStatus === 'on' ? 'off' : 'on' }
              : account
          )
        );
        addNotification('Error', 'Gagal mengirim perintah ke server.', 'take_profit_loss');
=======
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/accounts`);
        const data = await response.json();

        if (data && typeof data === 'object') {
          let serverAccounts = Object.values(data);
          const savedOrderJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedOrderJSON) {
            const savedOrder = JSON.parse(savedOrderJSON);
            const accountMap = new Map(serverAccounts.map(acc => [acc.id, acc]));
            const sortedAccounts = savedOrder.map(id => accountMap.get(id)).filter(Boolean);
            const newAccounts = serverAccounts.filter(acc => !savedOrder.includes(acc.id));
            setAccounts([...sortedAccounts, ...newAccounts]);
          } else {
            setAccounts(serverAccounts);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data dari server:", error);
        addNotification('Error', 'Gagal mengambil data dari server.', 'take_profit_loss');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleRobot = async (accountId, newStatus) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, robotStatus: newStatus } : acc));
    try {
      await fetch(`${API_URL}/api/robot-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, newStatus })
      });
    } catch (error) {
      console.error("Gagal mengirim perintah ke server:", error);
      setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, robotStatus: newStatus === 'on' ? 'off' : 'on' } : acc));
      addNotification('Error', 'Gagal mengirim perintah ke server.', 'take_profit_loss');
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
    }
  };

  const handleDragStart = (e, pos) => { dragItem.current = pos; setDragging(true); };
  const handleDragEnter = (e, pos) => { dragOverItem.current = pos; };
  const handleDragEnd = () => {
<<<<<<< HEAD
    if (dragOverItem.current === null) { setDragging(false); return; }
    const accountsCopy = [...accounts];
    const dragItemContent = accountsCopy[dragItem.current];
    accountsCopy.splice(dragItem.current, 1);
    accountsCopy.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null; dragOverItem.current = null;
    setAccounts(accountsCopy); setDragging(false);
=======
    if (dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      setDragging(false); dragItem.current = null; dragOverItem.current = null; return;
    }
    const copy = [...accounts];
    const dragged = copy[dragItem.current];
    copy.splice(dragItem.current, 1);
    copy.splice(dragOverItem.current, 0, dragged);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(copy.map(acc => acc.id)));
    setAccounts(copy);
    dragItem.current = null; dragOverItem.current = null; setDragging(false);
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard MetaTrader</h1>
            <p className="text-slate-400 mt-1">{page === 'dashboard' ? 'Ringkasan global dan status akun individual.' : 'Riwayat transaksi 1 minggu terakhir.'}</p>
          </div>
          {page === 'dashboard' ? (
<<<<<<< HEAD
            <button onClick={() => setPage('history')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                <History size={20} />
                <span>Lihat Riwayat</span>
            </button>
          ) : (
            <button onClick={() => setPage('dashboard')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                <ArrowLeft size={20} />
                <span>Kembali ke Dashboard</span>
=======
            <button onClick={() => setPage('history')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
              <History size={20} /><span>Lihat Riwayat</span>
            </button>
          ) : (
            <button onClick={() => setPage('dashboard')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
              <ArrowLeft size={20} /><span>Kembali ke Dashboard</span>
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
            </button>
          )}
        </header>

        <main>
          {page === 'dashboard' ? (
            <>
              <div className="mb-6 relative">
<<<<<<< HEAD
                <input type="text" placeholder="Cari nama akun..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
              <DashboardView accounts={accounts} searchTerm={searchTerm} onToggleRobot={handleToggleRobot} handleDragStart={handleDragStart} handleDragEnter={handleDragEnter} handleDragEnd={handleDragEnd} dragging={dragging} dragItem={dragItem} />
=======
                <input type="text" placeholder="Cari nama akun..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
              <DashboardView 
                accounts={accounts} searchTerm={searchTerm} onToggleRobot={handleToggleRobot}
                handleDragStart={handleDragStart} handleDragEnter={handleDragEnter} handleDragEnd={handleDragEnd}
                dragging={dragging} dragItem={dragItem}
              />
              <AccountList /> 
>>>>>>> da77c97b00ec707b7c10ecd17fc5dc3f03eb5ec7
            </>
          ) : (
            <HistoryPage accounts={accounts} history={history} />
          )}
        </main>
      </div>
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </div>
  );
}