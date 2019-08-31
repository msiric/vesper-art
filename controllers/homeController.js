const Artwork = require('../models/artwork');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Promocode = require('../models/promocode');
const Notification = require('../models/notification');
const Request = require('../models/request');

const fee = 3.15;

const getHomepage = async (req, res) => {
  try {
    const foundRequests = await Request.find({}).populate('poster');
    const foundArtwork = await Artwork.find({ active: true });
    return res.render('main/home', {
      requests: foundRequests,
      artwork: foundArtwork
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCreativeWriting = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'cw' }, { active: true }]
    });
    return res.render('main/creative-writing', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getMusic = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'm' }, { active: true }]
    });
    return res.render('main/music', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getVisualArts = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'va' }, { active: true }]
    });
    return res.render('main/visual-arts', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSearchResults = async (req, res, next) => {
  try {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.render('main/search-results', {
          content: content,
          searchResults: req.query.q
        });
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postSearchResults = async (req, res, next) => {
  try {
    if (req.body.search_input.trim()) {
      res.redirect('/search/?q=' + req.body.search_input);
    } else {
      return res.status(400).json({ message: 'Search cannot be empty' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await Notification.find({
      receiver: req.user._id
    })
      .populate('sender')
      .sort({ created: -1 });
    res.render('accounts/notifications', { notification: foundNotifications });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getHomepage,
  getCreativeWriting,
  getMusic,
  getVisualArts,
  getSearchResults,
  postSearchResults,
  postPromocode,
  deletePromocode,
  getNotifications
};
