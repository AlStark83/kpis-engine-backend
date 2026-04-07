export const normalizeData = (data = []) => {
  return data.map((item) => {
    return {
      id: item.id || item.id_reporte || null,
      fecha: formatFecha(item.fecha || item.fecha_pago),
      fechaFactura: formatFecha(
        item.fechaFactura || item.fecha_factura || item.factura_fecha
      ),
      fechaCobro: formatFecha(
        item.fechaCobro || item.fecha_cobro || item.fecha_pago || item.cobro_fecha
      ),
      monto: parseFloat(item.monto || item.importe_pagado || 0),
      estatus: normalizeStatus(item.estatus || item.estatus_pago),
      area: item.area || 'general',
      metadata: item
    };
  });
};

const formatFecha = (fecha) => {
  if (!fecha) return null;

  const parsed = new Date(fecha);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};

const normalizeStatus = (status) => {
  if (!status) return 'desconocido';

  return status.toLowerCase();
};
