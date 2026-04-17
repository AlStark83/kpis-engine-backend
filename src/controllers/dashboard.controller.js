import { getFiltrosService } from '../services/dashboard.service.js';

export const getFiltros = async (req, res) => {
  try {
    const filtros = await getFiltrosService();

    return res.json({
      success: true,
      data: filtros
    });
  } catch (error) {
    console.error('[dashboard.getFiltros] Error retrieving dashboard filters:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
