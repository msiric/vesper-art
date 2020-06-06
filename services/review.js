import mongoose from 'mongoose';
import Review from '../models/review.js';
import Notification from '../models/notification.js';
import Order from '../models/order.js';
import Artwork from '../models/artwork.js';
import User from '../models/user.js';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';

export const postReview = async ({ reviewRating, reviewContent, orderId }) => {
  const newReview = new Review();
  newReview.order = foundOrder._id;
  newReview.artwork = foundOrder.artwork._id;
  newReview.owner = res.locals.user.id;
  newReview.rating = reviewRating;
  if (reviewContent) newReview.content = reviewContent;
  return await newReview.save({ session });
};
