export const tableFormatter = ({ data, config = {} }) => {
  return {
    type: 'table',
    title: config.title ?? '',
    columns: data.columns ?? [],
    rows: data.rows ?? []
  };
};
