const ALERT_THRESHOLD_DAYS = 30;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getDayDifference = (fechaFactura, fechaCobro) => {
  if (!fechaFactura || !fechaCobro) {
    return null;
  }

  const factura = new Date(fechaFactura);
  const cobro = new Date(fechaCobro);

  if (Number.isNaN(factura.getTime()) || Number.isNaN(cobro.getTime())) {
    return null;
  }

  return (cobro.getTime() - factura.getTime()) / MILLISECONDS_PER_DAY;
};

export default (data = []) => {
  const validDifferences = data
    .map((item) => getDayDifference(item.fechaFactura, item.fechaCobro))
    .filter((difference) => difference !== null && difference >= 0);

  if (validDifferences.length === 0) {
    return {
      total: 0,
      count: data.length,
      processedCount: 0,
      semaforo: 'gris',
      threshold: ALERT_THRESHOLD_DAYS,
      unit: 'dias'
    };
  }

  const averageDays =
    validDifferences.reduce((sum, difference) => sum + difference, 0) /
    validDifferences.length;

  const roundedAverage = Number(averageDays.toFixed(2));

  return {
    total: roundedAverage,
    count: data.length,
    processedCount: validDifferences.length,
    semaforo: roundedAverage >= ALERT_THRESHOLD_DAYS ? 'rojo' : 'verde',
    threshold: ALERT_THRESHOLD_DAYS,
    unit: 'dias'
  };
};
