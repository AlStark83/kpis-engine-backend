// src/kpis/operaciones/carga_coordinadores.kpi.js
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "dbo.sp_Operaciones_total_reportes_por_coordinador",
	key: "carga_coordinadores",
	adapter: "carga_coordinadores",
	formatter: "carga_coordinadores",
	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			dateRangeMode: "any",
			includeSubclient: false,
		}),

	meta: {
		type: "coordinadores",
	},
};
