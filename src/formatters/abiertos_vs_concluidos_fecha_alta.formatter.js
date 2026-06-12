// src/formatters/abiertos_vs_concluidos_fecha_alta.formatter.js
export const abiertosVsConcluidosFechaAltaFormatter = ({
	data,
	config = {},
}) => {
	const rows = data.rows ?? [];

	return {
		type: "bar_chart",
		title: config.title ?? "Abiertos Vs Concluidos (Fecha de Alta)",
		categories: rows.map((row) => row.Mes),
		series: [
			{
				name: "Abiertos",
				data: rows.map((row) => row.Abiertos),
			},
			{
				name: "Concluidos",
				data: rows.map((row) => row.Concluidos),
			},
		],
		rows,
		meta: config.meta ?? null,
	};
};
