import { executeKPI } from '../core/engine.js';

export const runKPI = async ({ kpi, filters = {} }) => {
  if (!kpi) {
    throw new Error('KPI is required');
  }

  if (filters && typeof filters !== 'object') {
    throw new Error('Filters must be an object');
  }

  return executeKPI({ kpi, filters });
};
