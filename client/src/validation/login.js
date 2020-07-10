import * as Yup from "yup";

export const loginValidation = Yup.object().shape({
  userUsername: Yup.string().trim().required("Username or email is required"),
  userPassword: Yup.string()
    .trim()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
});
