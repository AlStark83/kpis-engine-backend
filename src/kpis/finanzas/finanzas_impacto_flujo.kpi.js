// src/kpis/finanzas/finanzas_impacto_flujo.kpi.js
import { FEATURES } from "../../config/features.js";
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "sp_Finanzas_impacto_en_flujo_rf",

	adapter: "card",

	formatter: "card",

	title: "Impacto flujo",

	fields: {
		valueField: "PorcentajeConcluidosConciliadosSinFacturar",
	},

	cardVariant: "impacto_flujo",

	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			includeDateRange: FEATURES.enableDateRangeFilters,
			includeStatus: false,
		}),
};
