// src/kpis/operaciones/concluidos_vs_activados.kpi.js
import { FEATURES } from "../../config/features.js";

export default {
  storedProcedure: 'dbo.sp_Operaciones_concluidos_vs_activados',
  adapter: 'table',
  formatter: 'table',
  meta: {
    type: 'resumen'
  }
};