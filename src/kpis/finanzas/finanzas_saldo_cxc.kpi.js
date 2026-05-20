// src/kpis/finanzas/finanzas_saldo_cxc.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "sp_Finanzas_Saldo_cxc_facturas_sin_cobrar",

	adapter: "card",

	formatter: "card",

	title: "Saldo CxC",

	fields: {
		valueField: "MontoTotalSinCobrar",
	},

	cardVariant: "saldo_cxc",
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
};
