import * as Yup from "yup";

export const loginValidation = Yup.object().shape({
  username: Yup.string().required("Username or email is required"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
});
