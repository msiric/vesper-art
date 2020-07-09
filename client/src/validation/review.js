import * as Yup from "yup";

export const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
  content: Yup.string().trim().required("Revieww cannot be empty"),
});
