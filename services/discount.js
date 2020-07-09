import mongoose from 'mongoose';
import Discount from '../models/discount.js';

export const fetchDiscountByCode = async ({ discountCode, session = null }) => {
  await Discount.findOne({
    name: discountCode,
  }).session(session);
};

export const fetchDiscountById = async ({ discountId, session = null }) => {
  await Discount.findOne({
    _id: discountId,
  }).session(session);
};