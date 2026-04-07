const PENDING_STATUS = 'pendiente';

export default (data = []) => {
  const pendingItems = data.filter((item) => item.estatus === PENDING_STATUS);

  const total = pendingItems.reduce((sum, item) => {
    return sum + (item.montoFactura || 0);
  }, 0);

  return {
    total: Number(total.toFixed(2)),
    count: data.length,
    pendingCount: pendingItems.length,
    unit: 'moneda'
  };
};
