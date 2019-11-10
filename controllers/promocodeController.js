const mongoose = require('mongoose');
const Promocode = require('../models/promocode');
const User = require('../models/user');

// needs transaction (done)
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
          const updatedUser = await User.updateOne(
            {
              $and: [{ _id: req.user._id }, { active: true }]
            },
            { discount: foundPromocode._id }
          ).session(session);
          if (updatedUser) {
            await session.commitTransaction();
            return res.status(200).json('Discount applied');
          } else {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Promo code expired' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Promo code does not exist' });
      }
    } else {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: 'You already have an active promo code' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
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
      const updatedUser = await User.update(
        {
          _id: req.user._id
        },
        {
          discount: null
        }
      ).session(session);
      if (updatedUser) {
        await session.commitTransaction();
        return res.status(200).json('Promocode removed');
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'User could not be updated' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Promocode not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

module.exports = {
  postPromocode,
  deletePromocode
};
