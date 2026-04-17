import { executeSP } from '../utils/db.js';

export const getFiltrosService = async () => {
  try {
    const [anios, estados, productos] = await Promise.all([
      executeSP('sp_dash_anios_disponibles'),
      executeSP('sp_dash_estados_usados'),
      executeSP('sp_dash_productos_usados')
    ]);

    return {
      anios,
      estados,
      productos
    };
  } catch (error) {
    console.error('[dashboard.getFiltrosService] Unexpected error:', error);

    return {
      anios: [],
      estados: [],
      productos: []
    };
  }
};
