import { executeKPI } from '../core/engine.js';

export const runKPI = async ({ kpi, source = 'json', data }) => {
  if (!kpi) {
    throw new Error('KPI is required');
  }

  if (!data) {
    throw new Error('Data is required');
  }

  const result = await executeKPI({ kpi, source, data });

  return {
    kpi,
    source,
    result
  };
};