// src/kpis/operaciones/abiertos_vs_concluidos_fecha_alta.kpi.js
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "dbo.sp_operaciones_abiertos_vs_concluidos_fecha_alta",
	adapter: "table",
	formatter: "abiertos_vs_concluidos_fecha_alta",

	mapFilters: (filters) => mapDashboardFiltersToSql(filters),

	meta: {
		type: "abiertos_vs_concluidos_fecha_alta",
	},
};
