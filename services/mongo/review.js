import Review from "../../models/review.js";

export const addNewReview = async ({
  orderData,
  reviewRating,
  userId,
  session = null,
}) => {
  const newReview = new Review();
  newReview.order = orderData.id;
  newReview.artwork = orderData.id;
  newReview.owner = userId;
  newReview.rating = reviewRating;
  return await newReview.save({ session });
};
