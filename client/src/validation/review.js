import * as Yup from "yup";

export const reviewValidation = Yup.object().shape({
  reviewRating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
  reviewContent: Yup.string().trim().required("Revieww cannot be empty"),
});
