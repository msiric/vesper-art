import * as Yup from "yup";

export const recoveryValidation = Yup.object().shape({
  userUsername: Yup.string().required("Username is required"),
  userEmail: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  userPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
});
