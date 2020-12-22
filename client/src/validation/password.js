import * as Yup from 'yup';

export const passwordValidation = Yup.object().shape({
  userCurrent: Yup.string().required('Enter your password'),
  userPassword: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter new password'),
  userConfirm: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});
