import { Review } from "../../entities/Review";

// $Needs testing (mongo -> postgres)
export const addNewReview = async ({
  reviewId,
  orderData,
  reviewRating,
  reviewerId,
  revieweeId,
  connection,
}) => {
  /*   const newReview = new Review();
  newReview.order = orderData.id;
  newReview.artwork = orderData.artwork.id;
  newReview.reviewerId = reviewerId;
  newReview.revieweeId = revieweeId;
  newReview.rating = reviewRating;
  return newReview; */

  const savedReview = await connection
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values([
      {
        id: reviewId,
        orderId: orderData.id,
        artworkId: orderData.artwork.id,
        reviewerId: reviewerId,
        revieweeId: revieweeId,
        rating: reviewRating,
      },
    ])
    .execute();
  console.log(savedReview);
  return savedReview;
};
