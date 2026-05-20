// src/kpis/finanzas/finanzas_antiguedad_servicios.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "sp_Finanzas_salud_por_cliente",

	adapter: "table",

	formatter: "table",

	title: "Bloque Clientes AAA",

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
			YEARS: normalize(filters.anio),

			...(FEATURES.enableDateRangeFilters && {
				FECHA_INICIO: normalize(filters.fechaInicio),
				FECHA_FIN: normalize(filters.fechaFin),
			}),

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
		type: "salud_cliente_finanzas",
	},
};
