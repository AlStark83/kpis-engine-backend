// src/kpis/operaciones/tiempo_gestion.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "dbo.sp_Operaciones_promedio_tiempo_gestion_concluidos",
	adapter: "table",
	formatter: "table",
	mapFilters: (filters) => {
		const normalize = (value) => {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				return null;
			}
			if (Array.isArray(value)) {
				return value.join(",");
			}
			return value;
		};

		const hasDateRange = filters.fechaInicio || filters.fechaFin;

		return {
			YEARS: normalize(filters.anio),
			
			// ...(FEATURES.enableDateRangeFilters && {
			// 	FECHA_INICIO: normalize(filters.fechaInicio),
			// 	FECHA_FIN: normalize(filters.fechaFin),
			// }),

			PRODUCT: normalize(filters.producto),
			CLIENT: normalize(filters.cliente),
			SERVICES: normalize(filters.servicio),
			COORDINATOR: normalize(filters.coordinador),
			STATUS: normalize(filters.estatus),
			// ❌ SUBCLIENT ELIMINADO
			SOLICITANTE: normalize(filters.solicitante),
			ESTADO: normalize(filters.estado),
			GESTOR: normalize(filters.gestor),
		};
	},
	meta: {
		type: "tiempo_gestion",
	},
};
