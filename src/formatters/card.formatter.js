// /src/formatters/card.formatter.js
export const cardFormatter = ({ data, config = {} }) => {
 return {
  type: 'card',

  variant:
    config.cardVariant ?? null,

  title:
    data.title ??
    config.title ??
    '',

  value:
    data.value ?? null,

  variation:
    data.variation ?? null,

  metadata:
    data.metadata ?? {}
};
};
