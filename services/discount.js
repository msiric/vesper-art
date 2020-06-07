import mongoose from 'mongoose';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import createError from 'http-errors';

export const postDiscount = async ({ userId, discountId }) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};

export const deleteDiscount = async ({ userId, discountId }) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};
