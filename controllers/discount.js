import mongoose from 'mongoose';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import createError from 'http-errors';

// needs transaction (done)
// treba sredit
const postDiscount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { discountCode } = req.body;
    const foundUser = User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).session(session);
    if (!foundUser.discount) {
      const foundDiscount = await Discount.findOne({
        name: discountCode,
      }).session(session);
      if (foundDiscount) {
        if (foundDiscount.active) {
          await User.updateOne(
            {
              $and: [{ _id: res.locals.user.id }, { active: true }],
            },
            { discount: foundDiscount._id }
          ).session(session);
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
    const foundDiscount = Discount.findOne({
      _id: discountId,
    }).session(session);
    const foundUser = User.findOne({
      $and: [
        { _id: res.locals.user.id },
        { discount: discountId },
        { active: true },
      ],
    }).session(session);
    if (foundDiscount && foundUser) {
      await User.updateOne(
        {
          $and: [{ _id: res.locals.user.id }, { active: true }],
        },
        { discount: foundDiscount._id }
      ).session(session);
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
