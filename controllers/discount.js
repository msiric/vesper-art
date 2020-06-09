import mongoose from 'mongoose';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import createError from 'http-errors';
import { fetchUserById, addUserDiscount } from '../services/user.js';
import {
  fetchDiscountByCode,
  fetchDiscountById,
} from '../services/discount.js';

// needs transaction (done)
// treba sredit
const postDiscount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { discountCode } = req.body;
    const foundUser = await fetchUserById({ userId: res.locals.user.id });
    if (!foundUser.discount) {
      const foundDiscount = await fetchDiscountByCode({
        discountCode,
      });
      if (foundDiscount) {
        if (foundDiscount.active) {
          await addUserDiscount({
            userId: res.locals.user.id,
            discountId: foundDiscount._id,
          });
          await session.commitTransaction();
          return res
            .status(200)
            .json({ message: 'Discount applied', payload: foundDiscount });
        } else {
          throw createError(400, 'Discount expired');
        }
      } else {
        throw createError(400, 'Discount not found');
      }
    } else {
      throw createError(400, 'User already has an applied discount');
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const deleteDiscount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { discountId } = req.params;
    const foundDiscount = await fetchDiscountById({ discountId });
    if (foundDiscount) {
      await deleteUserDiscount({ userId: res.locals.user.id });
      await session.commitTransaction();
      return res.status(200).json('Discount removed');
    } else {
      throw createError(400, 'Discount not found');
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

export default {
  postDiscount,
  deleteDiscount,
};
