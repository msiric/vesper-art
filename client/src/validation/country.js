import * as Yup from "yup";

export const countryValidation = Yup.object().shape({
  userCountry: Yup.string().required("Country cannot be empty"),
});
