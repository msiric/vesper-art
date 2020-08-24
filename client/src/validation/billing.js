import * as Yup from 'yup';

export const billingValidation = Yup.object().shape({
  billingName: Yup.string().trim().required('First name is required'),
  billingSurname: Yup.string().trim().required('Last name is required'),
  billingEmail: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  billingAddress: Yup.string().trim().required('Address is required'),
  billingZip: Yup.string().trim().required('Postal code is required'),
  billingCity: Yup.string().trim().required('City is required'),
  billingCountry: Yup.string().trim().required('Country is required'),
});
