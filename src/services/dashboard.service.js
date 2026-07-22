// /src/services/dashboard.service.js
import { mapDashboardFiltersToSql } from "../filters/filterBuilder.js";
import { executeSP } from "../utils/db.js";

const FILTER_PROCEDURES = {
	anios: {
		name: "sp_dash_anios_disponibles_filtros",
		params: [
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	estados: {
		name: "sp_dash_estados_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	productos: {
		name: "sp_dash_productos_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	clientes: {
		name: "sp_dash_clientes_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	subclientes: {
		name: "sp_dash_subclientes_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	coordinadores: {
		name: "sp_dash_coordinadores_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	gestores: {
		name: "sp_dash_gestores_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
	solicitantes: {
		name: "sp_dash_solicitantes_usados_filtros",
		params: [
			"YEARS",
			"PRODUCT",
			"CLIENT",
			"SERVICES",
			"COORDINATOR",
			"STATUS",
			"SUBCLIENTE",
			"SOLICITANTE",
			"ESTADO",
			"GESTOR",
		],
	},
};

const buildProcedureParams = (filters = {}, allowedParams = []) => {
	return mapDashboardFiltersToSql(filters, {
		allowedParams,
	});
};

export const getFiltrosService = async (filters = {}) => {
	try {
		const entries = Object.entries(FILTER_PROCEDURES);

		const results = await Promise.all(
			entries.map(async ([key, config]) => {
				const params = buildProcedureParams(filters, config.params);
				const data = await executeSP(config.name, params);
				return [key, data];
			}),
		);

		return Object.fromEntries(results);
	} catch (error) {
		console.error("[dashboard.getFiltrosService] Unexpected error:", error);
		return {
			anios: [],
			estados: [],
			productos: [],
			clientes: [],
			subclientes: [],
			coordinadores: [],
			gestores: [],
			solicitantes: [],
		};
	}
};
