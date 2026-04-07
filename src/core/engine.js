import { KPI_REGISTRY } from './registry.js';
import { normalizeData } from '../normalizers/base.normalizer.js';
import { ADAPTERS } from '../adapters/index.js';
import { FORMATTERS } from '../formatters/index.js';

export const executeKPI = async ({ kpi, source, data }) => {
  const kpiConfig = KPI_REGISTRY[kpi];

  if (!kpiConfig) {
    throw new Error(`KPI "${kpi}" not found`);
  }

  const adapter = ADAPTERS[source];

  if (!adapter) {
    throw new Error(`Adapter "${source}" not supported`);
  }

  const rawData = await adapter({ data });
  const normalizedData = normalizeData(rawData);

  const kpiModule = await import(
    `../kpis/${kpiConfig.module}/${kpiConfig.module}.kpi.js`
  );

  const kpiResult = await kpiModule.default(normalizedData);
  const formatter = FORMATTERS[kpiConfig.formatter];

  if (!formatter) {
    throw new Error(`Formatter "${kpiConfig.formatter}" not found`);
  }

  return formatter({
    title: kpiConfig.title,
    value: kpiResult.total,
    extra: Object.fromEntries(
      Object.entries(kpiResult).filter(([key]) => key !== 'total')
    )
  });
};
