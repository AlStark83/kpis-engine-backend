export const exampleAdapter = ({ rows = [] }) => {
  return {
    labels: rows.map((row) => row.area ?? ''),
    values: rows.map((row) => row.value ?? 0)
  };
};
