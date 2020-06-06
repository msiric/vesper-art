import mongoose from 'mongoose';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import createError from 'http-errors';

export const postDiscount = async ({ discountId }) => {
  return await User.updateOne(
    {
      $and: [{ _id: res.locals.user.id }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};

export const deleteDiscount = async ({ discountId }) => {
  return await User.updateOne(
    {
      $and: [{ _id: res.locals.user.id }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};
