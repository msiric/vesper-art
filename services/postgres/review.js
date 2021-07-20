import { Review } from "../../entities/Review";

export const addNewReview = async ({
  reviewId,
  orderData,
  reviewRating,
  reviewerId,
  revieweeId,
  connection,
}) => {
  const savedReview = await connection
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values([
      {
        id: reviewId,
        orderId: orderData.id,
        artworkId: orderData.artworkId,
        reviewerId: reviewerId,
        revieweeId: revieweeId,
        rating: reviewRating,
      },
    ])
    .execute();
  console.log(savedReview);
  return savedReview;
};
