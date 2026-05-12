export function cargaGestoresAdapter({ rows }) {
  return rows.map((row) => ({
    name: row.Gestor,
    value: Number(row.PorcentajeConclusion),
  }));
}