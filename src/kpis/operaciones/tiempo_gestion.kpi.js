// src/kpis/operaciones/tiempo_gestion.kpi.js
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "dbo.sp_Operaciones_promedio_tiempo_gestion_concluidos",
	adapter: "table",
	formatter: "table",
	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			dateRangeMode: "any",
			includeSubclient: false,
		}),
	meta: {
		type: "tiempo_gestion",
	},
};
