const isNil = (value) => value === undefined || value === null;

const sanitizeArray = (value) => {
  return value.filter((item) => !isNil(item) && item !== '');
};

const normalizeFilterValue = (value) => {
  if (Array.isArray(value)) {
    const sanitized = sanitizeArray(value);

    if (sanitized.length === 0) {
      return undefined;
    }

    return sanitized.join(',');
  }

  if (isNil(value) || value === '') {
    return undefined;
  }

  return String(value);
};

export const buildFilters = (filters = {}) => {
  return Object.entries(filters).reduce((accumulator, [key, value]) => {
    const normalizedValue = normalizeFilterValue(value);

    if (normalizedValue !== undefined) {
      accumulator[key] = normalizedValue;
    }

    return accumulator;
  }, {});
};
