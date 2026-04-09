let storedProcedureExecutor = null;

export const setStoredProcedureExecutor = (executor) => {
  if (typeof executor !== 'function') {
    throw new Error('Stored procedure executor must be a function');
  }

  storedProcedureExecutor = executor;
};

export const executeStoredProcedure = async ({
  procedure,
  params = {},
  kpiConfig = {}
}) => {
  if (!procedure) {
    throw new Error('Stored procedure name is required');
  }

  if (typeof storedProcedureExecutor === 'function') {
    const rows = await storedProcedureExecutor({
      procedure,
      params,
      kpiConfig
    });

    return Array.isArray(rows) ? rows : [];
  }

  if (Array.isArray(kpiConfig.mockRows)) {
    return kpiConfig.mockRows;
  }

  throw new Error(
    `No stored procedure executor configured for "${procedure}". ` +
      'Use setStoredProcedureExecutor() from src/services/db.service.js ' +
      'or define temporary mockRows in the KPI config.'
  );
};
