const mongoose = require('mongoose');
const Promocode = require('../models/promocode');
const User = require('../models/user');
const createError = require('http-errors');

// needs transaction (done)
// treba sredit
const postPromocode = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let promocode = req.body.promocode;
    if (!req.user.discount) {
      const foundPromocode = await Promocode.findOne({
        name: promocode
      }).session(session);
      if (foundPromocode) {
        if (foundPromocode.active) {
          await User.updateOne(
            {
              $and: [{ _id: req.user._id }, { active: true }]
            },
            { discount: foundPromocode._id }
          ).session(session);
          await session.commitTransaction();
          return res.status(200).json('Discount applied');
        } else {
          throw createError(400, 'Promo code expired');
        }
      } else {
        throw createError(400, 'Promo code not found');
      }
    } else {
      throw createError(400, 'You already have an active promo code');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const deletePromocode = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let promocode = req.body.promocode;
    const foundPromocode = Promocode.findOne({
      _id: promocode
    }).session(session);
    if (foundPromocode) {
      await User.updateOne(
        {
          _id: res.locals.user.id
        },
        {
          discount: null
        }
      ).session(session);

      await session.commitTransaction();
      return res.status(200).json('Promocode removed');
    } else {
      throw createError(400, 'Promo code not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  postPromocode,
  deletePromocode
};
