// src/kpis/finanzas/finanzas_antiguedad_servicios.kpi.js
import { FEATURES } from "../../config/features.js";
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "sp_finanzas_antiguedad_servicios_por_facturar_rf",

	adapter: "table",

	formatter: "table",

	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			includeDateRange: FEATURES.enableDateRangeFilters,
			includeStatus: false,
		}),

	meta: {
		type: "antiguedad_finanzas",
	},
};
