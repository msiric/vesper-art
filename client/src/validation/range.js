import * as Yup from 'yup';

// $TODO fix date validation

export const rangeValidation = Yup.object().shape({
  rangeFrom: Yup.string().trim().required(),
  rangeTo: Yup.string().trim().required(),
});
