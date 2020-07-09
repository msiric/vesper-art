import * as Yup from "yup";

export const passwordValidation = Yup.object().shape({
  current: Yup.string().required("Enter your password"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter new password"),
  confirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});
