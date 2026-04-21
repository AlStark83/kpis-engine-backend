import { QueryTypes } from 'sequelize';
import { conn as sequelize } from '../db.js';

const STORED_PROCEDURE_NAME_REGEX = /^[A-Za-z0-9_]+$/;

export const executeSP = async (spName, params = {}) => {
  if (!spName || !STORED_PROCEDURE_NAME_REGEX.test(spName)) {
    console.error(`[dashboard.executeSP] Invalid stored procedure name: ${spName}`);
    return [];
  }

  if (!sequelize || typeof sequelize.query !== 'function') {
    console.error(`[dashboard.executeSP] Database connection is not available for ${spName}`);
    return [];
  }

  try {
    const paramEntries = Object.entries(params).filter(([, value]) => value !== undefined);

    let statement = `EXEC ${spName}`;
    const replacements = {};

    if (paramEntries.length > 0) {
      const fragments = paramEntries.map(([key], index) => {
        const replacementKey = `p${index}`;
        replacements[replacementKey] = params[key];
        return `@${key} = :${replacementKey}`;
      });

      statement += ` ${fragments.join(', ')}`;
    }

    console.log('[dashboard.executeSP] statement:', statement);
    console.log('[dashboard.executeSP] replacements:', replacements);

    const rows = await sequelize.query(statement, {
      replacements,
      type: QueryTypes.SELECT
    });

    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error(`[dashboard.executeSP] Error executing ${spName}:`, error);
    return [];
  }
};
