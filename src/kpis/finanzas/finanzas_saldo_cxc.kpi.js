// src/kpis/finanzas/finanzas_saldo_cxc.kpi.js
import { FEATURES } from "../../config/features.js";
import { mapDashboardFiltersToSql } from "../../filters/filterBuilder.js";

export default {
	storedProcedure: "sp_Finanzas_Saldo_cxc_facturas_sin_cobrar_rf",

	adapter: "card",

	formatter: "card",

	title: "Saldo CxC",

	fields: {
		valueField: "MontoTotalSinCobrar",
	},

	cardVariant: "saldo_cxc",
	mapFilters: (filters) =>
		mapDashboardFiltersToSql(filters, {
			includeDateRange: FEATURES.enableDateRangeFilters,
			includeStatus: false,
		}),
};
