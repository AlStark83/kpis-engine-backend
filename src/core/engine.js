import { KPI_REGISTRY } from './registry.js';
import { normalizeData } from '../normalizers/base.normalizer.js';
import { ADAPTERS } from '../adapters/index.js';
import { FORMATTERS } from '../formatters/index.js';

export const executeKPI = async ({ kpi, source, data }) => {
  const kpiConfig = KPI_REGISTRY[kpi];

  if (!kpiConfig) {
    throw new Error(`KPI "${kpi}" not found`);
  }

  // 🔥 ADAPTER
  const adapter = ADAPTERS[source];

  if (!adapter) {
    throw new Error(`Adapter "${source}" not supported`);
  }

  const rawData = await adapter({ data });

  // 🔥 NORMALIZER
  const normalizedData = normalizeData(rawData);

  // 🔥 KPI
  const kpiModule = await import(
    `../kpis/${kpiConfig.module}/${kpiConfig.module}.kpi.js`
  );

  const kpiResult = await kpiModule.default(normalizedData);

  // 🎨 FORMATTER
  const formatter = FORMATTERS[kpiConfig.formatter];

  if (!formatter) {
    throw new Error(`Formatter "${kpiConfig.formatter}" not found`);
  }

  const formatted = formatter({
    title: kpiConfig.title,
    value: kpiResult.total, // 👈 aquí puedes ajustar según KPI
    extra: {
      count: kpiResult.count
    }
  });

  return formatted;
};