export default {
  key: 'example_table',
  title: 'Example Table KPI',
  storedProcedure: 'sp_example_table',
  adapter: 'table',
  formatter: 'table',
  columns: [
    { key: 'client', label: 'Client' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' }
  ],
  mockRows: [
    { client: 'ACME', amount: 1200, status: 'pending' },
    { client: 'Globex', amount: 980, status: 'paid' }
  ]
};
