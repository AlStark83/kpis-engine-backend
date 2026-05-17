// src/kpis/finanzas/finanzas_antiguedad_servicios.kpi.js

export default {
	storedProcedure: "sp_finanzas_antiguedad_servicios_por_facturar",

	adapter: "table",

	formatter: "table",

	mapFilters: (filters) => {
		const normalize = (value) => {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				return null;
			}

			if (Array.isArray(value)) {
				return value.join(",");
			}

			return value;
		};

		return {
			YEARS: normalize(filters.anio),
			PRODUCT: normalize(filters.producto),
			CLIENT: normalize(filters.cliente),
			SERVICES: normalize(filters.servicio),
			COORDINATOR: normalize(filters.coordinador),
			SUBCLIENTE: normalize(filters.subcliente),
			SOLICITANTE: normalize(filters.solicitante),
			ESTADO: normalize(filters.estado),
			GESTOR: normalize(filters.gestor),
		};
	},

	meta: {
		type: "antiguedad_finanzas",
	},
};
