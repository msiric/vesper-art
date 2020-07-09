import * as Yup from "yup";

export const licenseValidation = Yup.object().shape({
  licenseType: Yup.string()
    .matches(/(personal|commercial)/)
    .required("License type is required"),
});
