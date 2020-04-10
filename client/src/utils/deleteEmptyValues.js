const deleteEmptyValues = (values) => {
  for (let value in values) {
    if (values[value] === '') delete values[value];
  }
  return values;
};

export default deleteEmptyValues;
