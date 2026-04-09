const inferColumns = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  return Object.keys(rows[0]).map((key) => ({
    key,
    label: key
  }));
};

export const tableAdapter = ({ rows = [], config = {} }) => {
  const configuredColumns = config.columns;

  return {
    columns: Array.isArray(configuredColumns) && configuredColumns.length > 0
      ? configuredColumns
      : inferColumns(rows),
    rows: Array.isArray(rows) ? rows : []
  };
};
