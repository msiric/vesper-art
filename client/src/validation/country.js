import * as Yup from "yup";

export const countryValidation = Yup.object().shape({
  userCountry: Yup.string().trim().required("Country cannot be empty"),
});
