import { QueryTypes } from 'sequelize';
import { conn as sequelize } from '../db.js';

const STORED_PROCEDURE_NAME_REGEX = /^[A-Za-z0-9_]+$/;

export const executeSP = async (spName) => {
  if (!spName || !STORED_PROCEDURE_NAME_REGEX.test(spName)) {
    console.error(`[dashboard.executeSP] Invalid stored procedure name: ${spName}`);
    return [];
  }

  if (!sequelize || typeof sequelize.query !== 'function') {
    console.error(`[dashboard.executeSP] Database connection is not available for ${spName}`);
    return [];
  }

  try {
    const rows = await sequelize.query(`EXEC ${spName}`, {
      type: QueryTypes.SELECT
    });

    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error(`[dashboard.executeSP] Error executing ${spName}:`, error);
    return [];
  }
};
