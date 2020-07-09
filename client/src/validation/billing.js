import * as Yup from "yup";

export const billingValidation = Yup.object().shape({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().trim().required("Address is required"),
  zip: Yup.string().trim().required("Postal code is required"),
  city: Yup.string().trim().required("City is required"),
  country: Yup.string().trim().required("Country is required"),
});
