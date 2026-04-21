import { getFiltrosService } from '../services/dashboard.service.js';

export const getFiltros = async (req, res) => {
  try {
    const query = {
      anio: req.query.anio ?? req.query.YEARS ?? null,
      producto: req.query.producto ?? req.query.PRODUCT ?? null,
      cliente: req.query.cliente ?? req.query.CLIENT ?? null,
      servicio: req.query.servicio ?? req.query.SERVICES ?? null,
      coordinador: req.query.coordinador ?? req.query.COORDINATOR ?? null,
      estatus: req.query.estatus ?? req.query.STATUS ?? null,
      subcliente: req.query.subcliente ?? req.query.SUBCLIENTE ?? null,
      solicitante: req.query.solicitante ?? req.query.SOLICITANTE ?? null,
      estado: req.query.estado ?? req.query.ESTADO ?? null,
      gestor: req.query.gestor ?? req.query.GESTOR ?? null
    };

    const filtros = await getFiltrosService(query);

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