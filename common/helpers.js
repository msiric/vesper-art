export const formatDate = (date, form) => {
  return format(new Date(date), form);
};

export const formatPrice = (value) => {
  return currency(value).divide(100);
};
