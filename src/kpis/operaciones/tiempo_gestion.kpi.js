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
			FECHA_INICIO: hasDateRange ? normalize(filters.fechaInicio) : null,
			FECHA_FIN: hasDateRange ? normalize(filters.fechaFin) : null,
			YEARS: hasDateRange ? null : normalize(filters.anio),

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
