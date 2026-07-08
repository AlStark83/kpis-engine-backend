// src/formatters/resumen_operativo.formatter.js

const toNumber = (value, fallback = 0) => {
	const numberValue = Number(value);

	return Number.isFinite(numberValue) ? numberValue : fallback;
};

export const resumenOperativoFormatter = ({ data, config = {} }) => {
	const row = data.rows?.[0] ?? {};

	return {
		type: "summary_cards",
		title: config.title ?? "Resumen Operativo",
		items: [
			{
				key: "casos_activados",
				label: "Casos Activados",
				value: toNumber(row.TotalReportesActivados),
			},
			{
				key: "total_concluidos",
				label: "Total Concluidos",
				value: toNumber(row.TotalConcluidos),
			},
			{
				key: "total_cancelados",
				label: "Total Cancelados",
				value: toNumber(row.TotalCancelados),
			},
			{
				key: "casos_abiertos",
				label: "Casos Abiertos",
				value: toNumber(row.TotalAbiertos),
			},

			{
				key: "backlog",
				label: "Casos Abiertos (Backlog)",
				value: toNumber(row.PorcentajeAbiertos),
				suffix: "%",
			},
			{
				key: "conversion",
				label: "Eficiencia Conversión",
				value: toNumber(row.PorcentajeConcluidos),
				suffix: "%",
			},
			{
				key: "cancelacion",
				label: "Tasa Cancelación",
				value: toNumber(row.PorcentajeCancelados),
				suffix: "%",
			},

			{
				key: "tiempo_gestion",
				label: "Tiempo Promedio Gestión",
				value: toNumber(row.PromedioDiasGestion),
				suffix: " días",
				decimals: 1,
			},
			{
				key: "tiempo_cliente",
				label: "Tiempo Promedio Gestión Cliente",
				value: toNumber(row.PromedioDiasAltaConclusioncliente),
				suffix: " días",
				decimals: 1,
			},
		],
		meta: config.meta ?? null,
	};
};
