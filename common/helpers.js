import currency from 'currency.js';
import dateFns from 'date-fns';

export const formatDate = (date, form) => {
  return dateFns.format(new Date(date), form);
};

export const formatPrice = (value) => {
  return currency(value).divide(100);
};
