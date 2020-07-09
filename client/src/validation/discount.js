import * as Yup from "yup";

export const discountValidation = Yup.object().shape({
  discountCode: Yup.string().trim().required("Discount cannot be empty"),
});
