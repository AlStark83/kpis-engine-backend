// /src/adapters/index.js
import { cardAdapter } from './card.adapter.js';
import { chartAdapter } from './chart.adapter.js';
import { tableAdapter } from './table.adapter.js';
import { cargaCoordinadoresAdapter } from './cargaCoordinadores.adapter.js';
import { cargaGestoresAdapter } from './cargaGestores.adapter.js';

export const ADAPTERS = {
  card: cardAdapter,
  chart: chartAdapter,
  table: tableAdapter,
  carga_gestores: cargaGestoresAdapter,
  carga_coordinadores: cargaCoordinadoresAdapter

};
