import * as Yup from "yup";

export const resetValidation = Yup.object().shape({
  // $TODO Add proper password validation

  newPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
  confirmedPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
