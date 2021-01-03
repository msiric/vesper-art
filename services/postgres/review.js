import { Review } from "../../entities/Review";

// $Needs testing (mongo -> postgres)
export const addNewReview = async ({
  orderData,
  reviewRating,
  reviewerId,
  revieweeId,
}) => {
  /*   const newReview = new Review();
  newReview.order = orderData.id;
  newReview.artwork = orderData.artwork.id;
  newReview.reviewerId = reviewerId;
  newReview.revieweeId = revieweeId;
  newReview.rating = reviewRating;
  return newReview; */

  const savedReview = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values([
      {
        order: orderData.id,
        artwork: orderData.artwork.id,
        reviewerId: reviewerId,
        revieweeId: revieweeId,
        rating: reviewRating,
      },
    ])
    .execute();
  console.log(savedReview);
  return savedReview;
};
