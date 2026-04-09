import { buildFilters } from '../filters/filterBuilder.js';
import { executeStoredProcedure } from '../services/db.service.js';
import { getKPIConfig } from './registry.js';
import { ADAPTERS } from '../adapters/index.js';
import { FORMATTERS } from '../formatters/index.js';

export const executeKPI = async ({ kpi, filters = {} }) => {
  const kpiConfig = await getKPIConfig(kpi);
  const procedureParams = buildFilters(filters);

  const rawData = await executeStoredProcedure({
    procedure: kpiConfig.storedProcedure,
    params: procedureParams,
    kpiConfig
  });

  const adapter = ADAPTERS[kpiConfig.adapter];

  if (!adapter) {
    throw new Error(`Adapter "${kpiConfig.adapter}" not found`);
  }

  const adaptedData = adapter({
    rows: rawData,
    config: kpiConfig
  });

  const formatter = FORMATTERS[kpiConfig.formatter];

  if (!formatter) {
    throw new Error(`Formatter "${kpiConfig.formatter}" not found`);
  }

  const result = formatter({
    data: adaptedData,
    config: kpiConfig
  });

  return {
    kpi: kpiConfig.key,
    filters: procedureParams,
    result
  };
};
