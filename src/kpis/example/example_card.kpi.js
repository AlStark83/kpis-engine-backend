export default {
  key: 'example_card',
  title: 'Example Card KPI',
  storedProcedure: 'sp_example_card',
  adapter: 'card',
  formatter: 'card',
  fields: {
    valueField: 'value',
    variationField: 'variation'
  },
  mockRows: [
    {
      value: 1250,
      variation: 8.5
    }
  ]
};
