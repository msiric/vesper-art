const mongoose = require('mongoose');
const User = require('../models/user');
const Offer = require('../models/offer');
const Request = require('../models/request');
const createError = require('http-errors');

// needs transaction (done)
const postRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.find({
        $and: [{ owner: foundUser._id }, { active: true }]
      });
      if (!foundRequest.length) {
        let request = new Request();
        request.owner = res.locals.user.id;
        if (req.body.request_category)
          request.category = req.body.request_category;
        if (req.body.request_budget) request.budget = req.body.request_budget;
        if (req.body.request_delivery)
          request.delivery = req.body.request_delivery;
        request.description = req.body.request_description;
        request.active = true;
        await request.save({ session });
        await User.updateOne(
          {
            _id: res.locals.user.id
          },
          {
            $push: { requests: request._id }
          }
        ).session(session);
        await session.commitTransaction();
        return res.redirect('/');
      } else {
        throw createError(400, 'You already have an active request');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const deleteRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }]
      });
      if (foundRequest) {
        await User.updateOne(
          {
            _id: res.locals.user.id
          },
          {
            $pull: { requests: requestId }
          }
        ).session(session);

        await Request.deleteOne({
          _id: requestId
        }).session(session);
        await session.commitTransaction();
        return res.redirect('/');
      } else {
        throw createError(400, 'Request not found');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: res.locals.user.id });
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }]
      });
      if (foundRequest) {
        return res.json({
          request: foundRequest
        });
      } else {
        throw createError(400, 'Request not found');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (not tested)
const updateRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }]
      }).session(session);
      if (foundRequest) {
        if (req.body.request_category)
          foundRequest.category = req.body.request_category;
        if (req.body.request_budget)
          foundRequest.budget = req.body.request_budget;
        if (req.body.request_delivery)
          foundRequest.delivery = req.body.request_delivery;
        if (req.body.request_description) {
          foundRequest.description = req.body.request_description;
        }
        await foundRequest.save({ session });
        await session.commitTransaction();
        return res.redirect('/requests');
      } else {
        throw createError(400, 'Request not found');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getUserRequests = async (req, res, next) => {
  try {
    const foundRequests = await Request.find({
      owner: res.locals.user.id
    }).populate('owner');
    return res.json({ request: foundRequests });
  } catch (err) {
    next(err, res);
  }
};

const getUserRequest = async (req, res, next) => {
  try {
    const foundRequest = await Request.findOne({
      _id: req.params.id
    }).deepPopulate(['offers.buyer', 'offers.seller']);
    if (foundRequest) {
      const offers = [];
      if (foundRequest.offers) {
        foundRequest.offers.forEach(async offer => {
          const foundOffer = await Offer.find({ seller: offer.seller })
            .populate('buyer')
            .populate('seller');
          if (foundOffer) {
            offers.push(foundOffer);
          }
        });
      }
      return res.json({
        request: foundRequest,
        offers: offers
      });
    } else {
      throw createError(400, 'Request not found');
    }
  } catch (err) {
    next(err, res);
  }
};

const getUserOffers = async (req, res, next) => {
  try {
    const foundOffers = await Offer.find({
      seller: res.locals.user.id
    }).populate('buyer');
    return res.json({ offers: foundOffers });
  } catch (err) {
    next(err, res);
  }
};

const getUserOffer = async (req, res, next) => {
  try {
    const foundOffer = await Offer.findOne({ _id: req.params.id })
      .populate('buyer')
      .populate('seller');
    if (foundOffer) {
      const foundRequest = await Request.findOne({
        owner: offer.buyer
      }).populate('owner');
      if (foundRequest) {
        return res.json({
          offer: foundOffer,
          request: foundRequest
        });
      } else {
        throw createError(400, 'Request not found');
      }
    } else {
      throw createError(400, 'Offer not found');
    }
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  postRequest,
  deleteRequest,
  getRequest,
  updateRequest,
  getUserRequests,
  getUserRequest,
  getUserOffers,
  getUserOffer
};
