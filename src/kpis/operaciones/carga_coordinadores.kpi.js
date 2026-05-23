// src/kpis/operaciones/carga_coordinadores.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
	storedProcedure: "dbo.sp_Operaciones_total_reportes_por_coordinador",
	key: "carga_coordinadores",
	adapter: "carga_coordinadores",
	formatter: "carga_coordinadores",
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
			SOLICITANTE: normalize(filters.solicitante),
			ESTADO: normalize(filters.estado),
			GESTOR: normalize(filters.gestor),
		};
	},

	meta: {
		type: "coordinadores",
	},
};
