import mongoose from 'mongoose';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import createError from 'http-errors';

export const fetchDiscountByCode = async ({ discountCode }) => {
  await Discount.findOne({
    name: discountCode,
  }).session(session);
};

export const fetchDiscountById = async ({ discountId }) => {
  await Discount.findOne({
    _id: discountId,
  }).session(session);
};
