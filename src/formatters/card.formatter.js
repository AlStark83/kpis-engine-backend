export const cardFormatter = ({ data, config = {} }) => {
  return {
    type: 'card',
    title: data.title ?? config.title ?? '',
    value: data.value ?? null,
    variation: data.variation ?? null
  };
};
