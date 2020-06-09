import mongoose from 'mongoose';
import Review from '../models/review.js';
import Notification from '../models/notification.js';
import Order from '../models/order.js';
import Artwork from '../models/artwork.js';
import User from '../models/user.js';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';

export const postNewReview = async ({
  orderData,
  reviewRating,
  reviewContent,
  userId,
}) => {
  const newReview = new Review();
  newReview.order = orderData._id;
  newReview.artwork = orderData._id;
  newReview.owner = userId;
  newReview.rating = reviewRating;
  if (reviewContent) newReview.content = reviewContent;
  return await newReview.save({ session });
};
