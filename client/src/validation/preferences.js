import * as Yup from 'yup';

export const preferencesValidation = Yup.object().shape({
  userSaves: Yup.boolean().required('Saves need to have a value'),
});
