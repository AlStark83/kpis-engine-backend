export const normalizeData = (data = []) => {
  return data.map(item => {
    return {
      id: item.id || item.id_reporte || null,

      fecha: formatFecha(item.fecha || item.fecha_pago),

      monto: parseFloat(item.monto || item.importe_pagado || 0),

      estatus: normalizeStatus(item.estatus || item.estatus_pago),

      area: item.area || 'general',

      metadata: item
    };
  });
};

// helpers internos
const formatFecha = (fecha) => {
  if (!fecha) return null;

  // simplificado por ahora
  return fecha;
};

const normalizeStatus = (status) => {
  if (!status) return 'desconocido';

  return status.toLowerCase();
};