//src/kpis/finanzas/promedio_dias_cxc.kpi.js

export default {
  storedProcedure: "sp_Finanzas_promedio_dias_cxc",

  adapter: "card",

  formatter: "card",

  title: "CxC Promedio",

  fields: {
    valueField: "PromedioDiasCxC"
  }
};