const deleteEmptyValues = (values) => {
  for (let value in values) {
    if (typeof values[value] !== 'boolean' && !values[value])
      delete values[value];
  }
  return values;
};

export default deleteEmptyValues;
