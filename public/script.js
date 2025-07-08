// public/script.js (versi revisi dengan format angka)

// URL API relatif (karena server dan frontend sama)
const API_URL = "https://pond-rounded-lute.glitch.me/api/accounts";
console.log('API_URL yang dipakai:', API_URL);

// Ambil elemen DOM
const summaryContainer = document.getElementById('summary-dashboard');
const accountsContainer = document.getElementById('accounts-grid');
const searchBar = document.getElementById('search-bar');

let allAccounts = [];

// Fungsi format currency (dengan ribuan separator)
const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(value);
};

// Fungsi format angka biasa dengan ribuan separator
const formatNumber = (value, decimals = 3) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
};

// Fungsi render summary (atas)
const renderSummary = (accounts) => {
    const activeAccounts = accounts.filter(acc => acc.status === 'active');
    const profitable = activeAccounts.filter(acc => parseFloat(acc.profit) > 0).length;
    const losing = activeAccounts.filter(acc => parseFloat(acc.profit) < 0).length;
    const totalPL = accounts.reduce((sum, acc) => sum + (parseFloat(acc.profit) || 0), 0);
    const pending = activeAccounts.filter(acc =>
        acc.executionType && (acc.executionType.includes('limit') || acc.executionType.includes('stop'))
    ).length;

    summaryContainer.innerHTML = `
        <div class="stat-card"><div class="icon">📈</div><div><div class="title">Total Akun</div><div class="value">${accounts.length}</div></div></div>
        <div class="stat-card"><div class="icon">⚡</div><div><div class="title">Akun Aktif</div><div class="value">${activeAccounts.length}</div></div></div>
        <div class="stat-card"><div class="icon">🔼</div><div><div class="title">Floating Profit</div><div class="value text-green">${profitable}</div></div></div>
        <div class="stat-card"><div class="icon">🔽</div><div><div class="title">Floating Minus</div><div class="value text-red">${losing}</div></div></div>
        <div class="stat-card"><div class="icon">⏳</div><div><div class="title">Order Pending</div><div class="value" style="color:var(--yellow)">${pending}</div></div></div>
        <div class="stat-card"><div class="icon">💰</div><div><div class="title">Total P/L</div><div class="value ${totalPL >= 0 ? 'text-green' : 'text-red'}">${formatCurrency(totalPL)}</div></div></div>
    `;
};

// Fungsi render detail account cards (bawah)
const renderAccounts = (accounts) => {
    if (accounts.length === 0) {
        accountsContainer.innerHTML = '<p class="loading-text">Menunggu data dari akun...</p>';
        return;
    }

    accountsContainer.innerHTML = accounts.map(account => {
        const profitLoss = parseFloat(account.profit) || 0;
        const entryPrice = parseFloat(account.entryPrice);
        const currentPrice = parseFloat(account.currentPrice);
        const lotSize = parseFloat(account.lotSize);

        const isPending = account.executionType && (account.executionType.includes('limit') || account.executionType.includes('stop'));

        let borderColor = 'border-gray';
        if (account.status === 'active') {
            if (isPending) borderColor = 'border-yellow';
            else borderColor = profitLoss >= 0 ? 'border-green' : 'border-red';
        }

        let pillClass = 'pill-none';
        if (account.executionType && account.executionType.includes('buy')) pillClass = 'pill-buy';
        if (account.executionType && account.executionType.includes('sell')) pillClass = 'pill-sell';
        if (isPending) pillClass = 'pill-pending';

        return `
            <div class="account-card ${borderColor}">
                <div class="card-content">
                    <div class="card-header">
                        <span class="account-name">${account.accountName || 'N/A'}</span>
                        <span class="pill ${pillClass}">${(account.executionType || 'none').replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div class="card-body">
                        <div class="info-item"><div class="label">Pair</div><div class="value">${account.pair || '-'}</div></div>
                        <div class="info-item"><div class="label">Lot</div><div class="value">${!isNaN(lotSize) ? formatNumber(lotSize, 2) : '-'}</div></div>
                        <div class="info-item"><div class="label">Harga Masuk</div><div class="value">${!isNaN(entryPrice) ? formatNumber(entryPrice, 3) : '-'}</div></div>
                        <div class="info-item"><div class="label">Harga Sekarang</div><div class="value">${!isNaN(currentPrice) ? formatNumber(currentPrice, 3) : '-'}</div></div>
                        <div class="pl-display">
                            <div class="label">Profit/Loss</div>
                            <div class="value ${profitLoss >= 0 ? 'text-green' : 'text-red'}">${formatCurrency(profitLoss)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

// Fetch data akun dari API
const fetchData = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        allAccounts = Object.values(data).sort((a, b) => a.accountName.localeCompare(b.accountName));

        console.log('Data diterima dari server:', allAccounts);
        filterAndRender();
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
};

// Filter & render ulang saat search
const filterAndRender = () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filtered = searchTerm
        ? allAccounts.filter(acc => acc.accountName.toLowerCase().includes(searchTerm))
        : allAccounts;
    renderSummary(filtered);
    renderAccounts(filtered);
};

// Event listener search bar
searchBar.addEventListener('input', filterAndRender);

// Inisialisasi
fetchData();
setInterval(fetchData, 5000);
