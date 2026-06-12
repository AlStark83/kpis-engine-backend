// /src/core/registry.js
export const KPI_REGISTRY = {
	// =========================
	// OPERACIONES
	// =========================
	tiempo_gestion: {
		modulePath: "../kpis/operaciones/tiempo_gestion.kpi.js",
	},
	concluidos_vs_activados: {
		modulePath: "../kpis/operaciones/concluidos_vs_activados.kpi.js",
	},
	carga_coordinadores: {
		modulePath: "../kpis/operaciones/carga_coordinadores.kpi.js",
	},
	carga_gestores: {
		modulePath: "../kpis/operaciones/carga_gestores.kpi.js",
	},
	resumen_operativo: {
		modulePath: "../kpis/operaciones/resumen_operativo.kpi.js",
	},
	abiertos_vs_concluidos_fecha_alta: {
		modulePath: "../kpis/operaciones/abiertos_vs_concluidos_fecha_alta.kpi.js",
	},
	// =========================
	// FINANZAS
	// =========================
	finanzas_promedio_dias_cxc: {
		modulePath: "../kpis/finanzas/promedio_dias_cxc.kpi.js",
	},
	finanzas_saldo_cxc: {
		modulePath: "../kpis/finanzas/finanzas_saldo_cxc.kpi.js",
	},
	finanzas_impacto_flujo: {
		modulePath: "../kpis/finanzas/finanzas_impacto_flujo.kpi.js",
	},
	finanzas_antiguedad_servicios: {
		modulePath: "../kpis/finanzas/finanzas_antiguedad_servicios.kpi.js",
	},
	finanzas_salud_cliente: {
		modulePath: "../kpis/finanzas/finanzas_salud_cliente.kpi.js",
	},
};

export const getKPIConfig = async (kpiKey) => {
	const registryEntry = KPI_REGISTRY[kpiKey];

	if (!registryEntry) {
		throw new Error(`KPI "${kpiKey}" not found`);
	}

	const kpiModule = await import(registryEntry.modulePath);
	const kpiConfig = kpiModule.default;

	if (!kpiConfig?.storedProcedure) {
		throw new Error(`KPI "${kpiKey}" is missing "storedProcedure"`);
	}

	if (!kpiConfig?.adapter) {
		throw new Error(`KPI "${kpiKey}" is missing "adapter"`);
	}

	if (!kpiConfig?.formatter) {
		throw new Error(`KPI "${kpiKey}" is missing "formatter"`);
	}

	return {
		key: kpiKey,
		...kpiConfig,
	};
};
