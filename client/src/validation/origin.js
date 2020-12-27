import * as Yup from "yup";

export const originValidation = Yup.object().shape({
  userBusinessAddress: Yup.string().trim().required("Country cannot be empty"),
});
