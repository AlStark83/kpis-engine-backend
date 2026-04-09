export default {
  key: 'example_chart',
  title: 'Example Chart KPI',
  storedProcedure: 'sp_example_chart',
  adapter: 'chart',
  formatter: 'chart',
  fields: {
    labelField: 'area',
    valueField: 'value'
  },
  options: {
    chartType: 'bar',
    datasetLabel: 'Example'
  },
  mockRows: [
    { area: 'Finanzas', value: 92 },
    { area: 'Operaciones', value: 87 },
    { area: 'Ventas', value: 95 }
  ]
};
