import * as Yup from "yup";

export const emailValidation = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
});
