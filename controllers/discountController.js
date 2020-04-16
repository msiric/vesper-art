const mongoose = require('mongoose');
const Discount = require('../models/discount');
const User = require('../models/user');
const createError = require('http-errors');

// needs transaction (done)
// treba sredit
const postDiscount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { discount } = req.body;
    if (!discount) {
      const foundDiscount = await Discount.findOne({
        name: discount,
      }).session(session);
      if (foundDiscount) {
        if (foundDiscount.active) {
          await User.updateOne(
            {
              $and: [{ _id: req.user._id }, { active: true }],
            },
            { discount: foundDiscount._id }
          ).session(session);
          await session.commitTransaction();
          return res.status(200).json('Discount applied');
        } else {
          throw createError(400, 'Discount expired');
        }
      } else {
        throw createError(400, 'Discount not found');
      }
    } else {
      throw createError(400, 'You already have an active discount');
    }
  } catch (err) {
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
    const { discount } = req.body;
    const foundDiscount = Discount.findOne({
      _id: discount,
    }).session(session);
    if (foundDiscount) {
      await User.updateOne(
        {
          _id: res.locals.user.id,
        },
        {
          discount: null,
        }
      ).session(session);

      await session.commitTransaction();
      return res.status(200).json('Discount removed');
    } else {
      throw createError(400, 'Discount not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  postDiscount,
  deleteDiscount,
};
