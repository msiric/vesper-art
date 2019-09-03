const Promocode = require('../models/promocode');
const User = require('../models/user');

const postPromocode = async (req, res, next) => {
  try {
    let promocode = req.body.promocode;
    if (!req.user.discount) {
      const foundPromocode = await Promocode.findOne({ name: promocode });
      if (foundPromocode) {
        if (foundPromocode.active) {
          const updatedUser = await User.updateOne(
            {
              $and: [{ _id: req.user._id }, { active: true }]
            },
            { discount: foundPromocode._id }
          );
          if (updatedUser) {
            return res.status(200).json('Discount applied');
          } else {
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          return res.status(400).json({ message: 'Promo code expired' });
        }
      } else {
        return res.status(400).json({ message: 'Promo code does not exist' });
      }
    } else {
      return res
        .status(400)
        .json({ message: 'You already have an active promo code' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePromocode = async (req, res, next) => {
  try {
    let promocode = req.body.promocode;
    const foundPromocode = Promocode.findOne({
      _id: promocode
    });
    if (foundPromocode) {
      const updatedUser = await User.update(
        {
          _id: req.user._id
        },
        {
          discount: null
        }
      );
      if (updatedUser) {
        return res.status(200).json('Promocode removed');
      } else {
        return res.status(400).json({ message: 'User could not be updated' });
      }
    } else {
      return res.status(400).json({ message: 'Promocode not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postPromocode,
  deletePromocode
};
