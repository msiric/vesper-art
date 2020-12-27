import * as Yup from "yup";

export const preferencesValidation = Yup.object().shape({
  userFavorites: Yup.boolean().required("Favorites need to have a value"),
});
