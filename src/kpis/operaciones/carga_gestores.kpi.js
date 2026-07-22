// src/kpis/operaciones/carga_gestores.kpi.js
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "dbo.sp_Operaciones_total_reportes_por_gestor",
	adapter: "carga_gestores",
	formatter: "carga_gestores",

	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			dateRangeMode: "any",
			includeSubclient: false,
		}),
	meta: {
		type: "gestores",
	},
};
