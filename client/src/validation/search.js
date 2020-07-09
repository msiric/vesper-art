import * as Yup from 'yup';

export const searchValidation = Yup.object().shape({
  searchQuery: Yup.string().allow(''),
  searchType: Yup.string().valid('artwork', 'users').required(),
});
