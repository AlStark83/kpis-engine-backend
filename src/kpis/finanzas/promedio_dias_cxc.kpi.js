// src/kpis/finanzas/promedio_dias_cxc.kpi.js
import { FEATURES } from "../../config/features.js";
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "sp_Finanzas_promedio_dias_cxc_rf",

	adapter: "card",

	formatter: "card",

	title: "CxC Promedio",

	fields: {
		valueField: "PromedioDiasCxC",
	},

	cardVariant: "cxc_promedio",

	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			includeDateRange: FEATURES.enableDateRangeFilters,
			includeStatus: false,
		}),
};
