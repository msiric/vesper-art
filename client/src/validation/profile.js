import * as Yup from "yup";

export const profileValidation = Yup.object().shape({
  userDescription: Yup.string().trim(),
  userCountry: Yup.string().trim(),
});
