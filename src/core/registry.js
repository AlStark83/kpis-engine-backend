export const KPI_REGISTRY = {
  finanzas_cobranza: {
    modulePath: '../kpis/finanzas/finanzas_cobranza.kpi.js'
  },
  example_card: {
    modulePath: '../kpis/example/example_card.kpi.js'
  },
  example_chart: {
    modulePath: '../kpis/example/example_chart.kpi.js'
  },
  example_table: {
    modulePath: '../kpis/example/example_table.kpi.js'
  }
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
    ...kpiConfig
  };
};
