export const chartFormatter = ({ data, config = {} }) => {
  return {
    type: 'chart',
    title: config.title ?? '',
    chartType: data.chartType ?? config.options?.chartType ?? 'bar',
    labels: data.labels ?? [],
    datasets: data.datasets ?? []
  };
};
