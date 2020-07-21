import currency from 'currency.js';
import * as fns from 'date-fns';
const { format } = fns;

export const formatDate = (date, form) => {
  return format(new Date(date), form);
};

export const formatPrice = (value) => {
  return currency(value).divide(100);
};
