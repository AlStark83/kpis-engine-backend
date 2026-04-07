const COMPLETED_STATUSES = new Set(['concluido', 'concluida', 'finalizado', 'finalizada']);
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getAgeInDays = (fechaConclusion) => {
  if (!fechaConclusion) {
    return null;
  }

  const conclusionDate = new Date(fechaConclusion);

  if (Number.isNaN(conclusionDate.getTime())) {
    return null;
  }

  const now = new Date();
  return (now.getTime() - conclusionDate.getTime()) / MILLISECONDS_PER_DAY;
};

export default (data = []) => {
  const eligibleItems = data.filter((item) => {
    return COMPLETED_STATUSES.has(item.estatus) && item.tieneFactura === false;
  });

  const validAges = eligibleItems
    .map((item) => getAgeInDays(item.fechaConclusion))
    .filter((age) => age !== null && age >= 0);

  if (validAges.length === 0) {
    return {
      total: 0,
      count: data.length,
      processedCount: 0,
      eligibleCount: eligibleItems.length,
      unit: 'dias'
    };
  }

  const averageAge =
    validAges.reduce((sum, age) => sum + age, 0) / validAges.length;

  return {
    total: Number(averageAge.toFixed(2)),
    count: data.length,
    processedCount: validAges.length,
    eligibleCount: eligibleItems.length,
    unit: 'dias'
  };
};
