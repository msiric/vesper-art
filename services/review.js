import mongoose from 'mongoose';
import Review from '../models/review.js';

export const addNewReview = async ({
  orderData,
  reviewRating,
  reviewContent,
  userId,
  session = null,
}) => {
  const newReview = new Review();
  newReview.order = orderData._id;
  newReview.artwork = orderData._id;
  newReview.owner = userId;
  newReview.rating = reviewRating;
  if (reviewContent) newReview.content = reviewContent;
  return await newReview.save({ session });
};
