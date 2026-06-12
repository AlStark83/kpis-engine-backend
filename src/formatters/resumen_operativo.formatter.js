// src/formatters/resumen_operativo.formatter.js
export const resumenOperativoFormatter = ({ data, config = {} }) => {
	const row = data.rows?.[0] ?? {};

	return {
		type: "summary_cards",
		title: config.title ?? "Resumen Operativo",
		items: [
			{ key: "casos_activados", label: "Casos Activados", value: row.TotalReportesActivados },
			{ key: "total_concluidos", label: "Total Concluidos", value: row.TotalConcluidos },
			{ key: "total_cancelados", label: "Total Cancelados", value: row.TotalCancelados },
			{ key: "casos_abiertos", label: "Casos Abiertos", value: row.TotalAbiertos },
			{ key: "backlog", label: "Casos Abiertos (Backlog)", value: row.PorcentajeAbiertos, suffix: "%" },
			{ key: "conversion", label: "Eficiencia Conversión", value: row.PorcentajeConcluidos, suffix: "%" },
			{ key: "cancelacion", label: "Tasa Cancelación", value: row.PorcentajeCancelados, suffix: "%" },
			{ key: "tiempo_gestion", label: "Tiempo Promedio Gestión", value: row.PromedioDiasGestion, suffix: " días" },
			{ key: "tiempo_cliente", label: "Tiempo Promedio Gestión Cliente", value: row.PromedioDiasAltaConclusioncliente, suffix: " días" },
		],
		meta: config.meta ?? null,
	};
};