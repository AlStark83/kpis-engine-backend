const getFirstRow = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {};
  }

  return rows[0] ?? {};
};

export const cardAdapter = ({ rows = [], config = {} }) => {
  const row = getFirstRow(rows);
  const valueField = config.fields?.valueField ?? 'value';
  const variationField = config.fields?.variationField ?? 'variation';

  return {
    title: config.title ?? '',
    value: row[valueField] ?? null,
    variation: row[variationField] ?? null,
    metadata: row
  };
};
