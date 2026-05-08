export function cargaCoordinadoresAdapter({ rows }) {
  return rows.map((row) => ({
    name: row.Coordinador,
    value: Number(row.PorcentajeConclusion),
  }));
}