// src/kpis/finanzas/finanzas_antiguedad_servicios.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "sp_finanzas_antiguedad_servicios_por_facturar_rf",

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

		const hasDateRange = filters.fechaInicio || filters.fechaFin;

		return {
			YEARS: hasDateRange ? null : normalize(filters.anio),

			...(FEATURES.enableDateRangeFilters && {
				FECHA_INICIO: normalize(filters.fechaInicio),
				FECHA_FIN: normalize(filters.fechaFin),
			}),

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
