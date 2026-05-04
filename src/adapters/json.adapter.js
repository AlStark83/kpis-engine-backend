// /src/adapters/json.adapter.js
export const jsonAdapter = async ({ data }) => {
  if (!data) {
    throw new Error('No data provided for JSON adapter');
  }

  return data;
};