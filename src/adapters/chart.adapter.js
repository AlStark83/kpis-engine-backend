const buildSingleDataset = ({ rows, labelField, valueField, datasetLabel }) => {
  return {
    labels: rows.map((row) => row[labelField] ?? ''),
    datasets: [
      {
        label: datasetLabel,
        data: rows.map((row) => row[valueField] ?? 0)
      }
    ]
  };
};

const buildMultiDataset = ({
  rows,
  labelField,
  valueField,
  seriesField
}) => {
  const labels = [...new Set(rows.map((row) => row[labelField] ?? ''))];
  const seriesNames = [...new Set(rows.map((row) => row[seriesField] ?? ''))];

  const datasets = seriesNames.map((seriesName) => {
    const seriesRows = rows.filter((row) => row[seriesField] === seriesName);

    return {
      label: seriesName,
      data: labels.map((label) => {
        const match = seriesRows.find((row) => row[labelField] === label);
        return match?.[valueField] ?? 0;
      })
    };
  });

  return {
    labels,
    datasets
  };
};

export const chartAdapter = ({ rows = [], config = {} }) => {
  const labelField = config.fields?.labelField ?? 'label';
  const valueField = config.fields?.valueField ?? 'value';
  const seriesField = config.fields?.seriesField;
  const datasetLabel = config.options?.datasetLabel ?? config.title ?? 'Series';

  const normalizedRows = Array.isArray(rows) ? rows : [];

  const chartData = seriesField
    ? buildMultiDataset({
        rows: normalizedRows,
        labelField,
        valueField,
        seriesField
      })
    : buildSingleDataset({
        rows: normalizedRows,
        labelField,
        valueField,
        datasetLabel
      });

  return {
    chartType: config.options?.chartType ?? 'bar',
    ...chartData
  };
};
