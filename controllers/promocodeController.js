const Promocode = require('../models/promocode');
const User = require('../models/user');

const fee = 3.15;

const postPromocode = async (req, res, next) => {
  try {
    let promocode = req.body.promocode;
    let totalPrice = req.session.price;
    let subtotal = totalPrice - fee;
    if (!req.session.discount) {
      const foundPromocode = await Promocode.findOne({ name: promocode });
      if (foundPromocode) {
        let discount = foundPromocode.discount * 100;
        let promo = foundPromocode._id;
        subtotal = (totalPrice - fee) * (1 - foundPromocode.discount);
        totalPrice = subtotal + fee;
        req.session.price = totalPrice;
        req.session.discount = foundPromocode._id;
        return res.status(200).json({ totalPrice, subtotal, discount, promo });
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
    let totalPrice = req.session.price;
    let subtotal = totalPrice - fee;

    const foundPromocode = Promocode.findOne({ _id: promocode });
    if (foundPromocode) {
      const updatedUser = await User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { promos: foundPromocode._id }
        }
      );
      if (updatedUser) {
        let discount = foundPromocode.discount;
        subtotal = totalPrice - fee;
        subtotal = subtotal / (1 - discount);
        totalPrice = subtotal + fee;
        req.session.price = totalPrice;
        req.session.discount = null;
        return res.status(200).json({ totalPrice, subtotal });
      } else {
        return res.status(400).json({ message: 'User could not be updated' });
      }
    } else {
      return res.status(400).json({ message: 'Promo code could not be found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postPromocode,
  deletePromocode
};
