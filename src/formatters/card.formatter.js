export const cardFormatter = ({ title, value, extra = {} }) => {
  return {
    type: 'card',
    title,
    value,
    ...extra
  };
};