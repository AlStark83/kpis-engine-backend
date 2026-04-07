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
      fechaConclusion: formatFecha(
        item.fechaConclusion ||
          item.fecha_conclusion ||
          item.fechaConclusión ||
          item.fecha_cierre ||
          item.fechaCierre
      ),
      montoFactura: parseAmount(
        item.montoFactura ||
          item.monto_factura ||
          item.importe_factura ||
          item.total_factura ||
          item.saldo_pendiente
      ),
      monto: parseAmount(item.monto || item.importe_pagado),
      estatus: normalizeStatus(item.estatus || item.estatus_pago),
      tieneFactura: normalizeInvoiceFlag(item),
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

const parseAmount = (value) => {
  const amount = parseFloat(value || 0);

  if (Number.isNaN(amount)) {
    return 0;
  }

  return amount;
};

const normalizeStatus = (status) => {
  if (!status) return 'desconocido';

  return status.toLowerCase();
};

const normalizeInvoiceFlag = (item) => {
  const rawFlag =
    item.tieneFactura ??
    item.tiene_factura ??
    item.facturada ??
    item.estaFacturado ??
    item.esta_facturado;

  if (typeof rawFlag === 'boolean') {
    return rawFlag;
  }

  if (typeof rawFlag === 'number') {
    return rawFlag === 1;
  }

  if (typeof rawFlag === 'string') {
    const normalized = rawFlag.trim().toLowerCase();

    if (['true', '1', 'si', 'sí', 'yes', 'facturada', 'con factura'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'sin factura', 'pendiente'].includes(normalized)) {
      return false;
    }
  }

  return Boolean(
    item.fechaFactura ||
      item.fecha_factura ||
      item.factura_fecha ||
      item.uuid_factura ||
      item.folio_factura
  );
};
