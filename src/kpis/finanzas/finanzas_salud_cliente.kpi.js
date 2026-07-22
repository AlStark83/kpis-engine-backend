// src/kpis/finanzas/finanzas_salud_cliente.kpi.js
import { FEATURES } from "../../config/features.js";
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "sp_Finanzas_salud_por_cliente_rf",

	adapter: "table",

	formatter: "table",

	title: "Bloque Clientes AAA",

	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			includeDateRange: FEATURES.enableDateRangeFilters,
			includeStatus: false,
		}),

	meta: {
		type: "salud_cliente_finanzas",
	},
};
