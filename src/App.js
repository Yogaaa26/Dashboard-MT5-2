const handleToggleRobot = async (accountId, newStatus) => {
  console.log("Kirim toggle robot:", accountId, newStatus);

  // Optimistic UI update
  setAccounts(prevAccounts =>
    prevAccounts.map(account =>
      account.id === accountId
        ? { ...account, robotStatus: newStatus }
        : account
    )
  );

  try {
    const response = await fetch(`${API_URL}/api/robot-toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, newStatus })
    });
    const data = await response.json();
    console.log("Respon dari server:", data);

    if (!data.success) {
      throw new Error('Server mengembalikan gagal');
    }

    addNotification('Sukses', `Robot berhasil di${newStatus === 'on' ? 'aktifkan' : 'nonaktifkan'}.`, 'take_profit_profit');
  } catch (error) {
    console.error("Gagal kirim toggle robot:", error);
    // Rollback UI update
    setAccounts(prevAccounts =>
