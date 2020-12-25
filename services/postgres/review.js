import { Review } from "../../entities/Review";

// $Needs testing (mongo -> postgres)
export const addNewReview = async ({
  orderData,
  reviewRating,
  reviewerId,
  revieweeId,
}) => {
  const newReview = new Review();
  newReview.order = orderData.id;
  newReview.artwork = orderData.id;
  newReview.reviewerId = reviewerId;
  newReview.revieweeId = revieweeId;
  newReview.rating = reviewRating;
  return await newReview.save();
};
