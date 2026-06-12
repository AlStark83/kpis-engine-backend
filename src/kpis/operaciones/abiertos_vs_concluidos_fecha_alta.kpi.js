// src/kpis/operaciones/abiertos_vs_concluidos_fecha_alta.kpi.js

export default {
	storedProcedure: "dbo.sp_operaciones_abiertos_vs_concluidos_fecha_alta",
	adapter: "table",
	formatter: "abiertos_vs_concluidos_fecha_alta",

	mapFilters: (filters) => {
		const normalize = (value) => {
			if (!value || (Array.isArray(value) && value.length === 0)) return null;
			if (Array.isArray(value)) return value.join(",");
			return value;
		};

		const hasDateRange = filters.fechaInicio && filters.fechaFin;

		return {
			FECHA_INICIO: hasDateRange ? normalize(filters.fechaInicio) : null,
			FECHA_FIN: hasDateRange ? normalize(filters.fechaFin) : null,
			YEARS: hasDateRange ? null : normalize(filters.anio),

			PRODUCT: normalize(filters.producto),
			CLIENT: normalize(filters.cliente),
			SERVICES: normalize(filters.servicio),
			COORDINATOR: normalize(filters.coordinador),
			STATUS: normalize(filters.estatus),
			SUBCLIENTE: normalize(filters.subcliente),
			SOLICITANTE: normalize(filters.solicitante),
			ESTADO: normalize(filters.estado),
			GESTOR: normalize(filters.gestor),
		};
	},

	meta: {
		type: "abiertos_vs_concluidos_fecha_alta",
	},
};
