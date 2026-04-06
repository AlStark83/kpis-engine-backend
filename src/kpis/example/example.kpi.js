export default (data) => {
  const total = data.reduce((acc, item) => {
    return acc + (item.monto || 0);
  }, 0);

  return {
    total,
    count: data.length
  };
};