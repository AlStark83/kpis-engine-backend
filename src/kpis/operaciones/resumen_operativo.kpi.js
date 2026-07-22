// src/kpis/operaciones/resumen_operativo.kpi.js
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "dbo.sp_dashboard_resumen_operativo",
	adapter: "table",
	formatter: "resumen_operativo",

	mapFilters: (filters) => mapDashboardFiltersToSql(filters),

	meta: {
		type: "resumen_operativo",
	},
};
