//src/formatters/cargaGestores.formatter.js

export function cargaGestoresFormatter({ data }) {

  const getLevel = (value) => {
    if (value >= 80) return "Alta";
    if (value >= 50) return "Media";
    return "Baja";
  };

  const items = data.map((item) => ({
    ...item,
    level: getLevel(item.value),
  }));

  const total = items.length;
  const average = Math.round(
    items.reduce((acc, i) => acc + i.value, 0) / total
  );
  const max = Math.max(...items.map((i) => i.value));

  return {
    type: "card_list",
    title: "Carga de Gestores",
    items,
    summary: {
      total,
      average,
      max,
    },
  };
}