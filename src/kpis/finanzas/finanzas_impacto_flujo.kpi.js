// src/kpis/finanzas/finanzas_impacto_flujo.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "sp_Finanzas_impacto_en_flujo_rf",

	adapter: "card",

	formatter: "card",

	title: "Impacto flujo",

	fields: {
		valueField: "PorcentajeConcluidosConciliadosSinFacturar",
	},

	cardVariant: "impacto_flujo",

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

		const hasCompleteDateRange = filters.fechaInicio && filters.fechaFin;

		return {
			YEARS: hasCompleteDateRange ? null : normalize(filters.anio),

			...(FEATURES.enableDateRangeFilters && {
				FECHA_INICIO: hasCompleteDateRange
					? normalize(filters.fechaInicio)
					: null,
				FECHA_FIN: hasCompleteDateRange ? normalize(filters.fechaFin) : null,
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
};
