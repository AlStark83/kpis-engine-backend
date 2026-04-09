export default {
  key: 'finanzas_cobranza',
  title: 'Finanzas cobranza',
  storedProcedure: 'sp_finanzas_cobranza',
  adapter: 'chart',
  formatter: 'chart',
  fields: {
    labelField: 'area',
    valueField: 'value'
  },
  options: {
    chartType: 'bar',
    datasetLabel: 'Cobranza'
  }
};
