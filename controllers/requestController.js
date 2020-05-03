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
    const {
      requestCategory,
      requestBudget,
      requestDelivery,
      requestDescription,
    } = req.body;
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.find({
        $and: [{ owner: foundUser._id }, { active: true }],
      });
      if (!foundRequest.length) {
        let request = new Request();
        request.owner = res.locals.user.id;
        if (requestCategory) request.category = requestCategory;
        if (requestBudget) request.budget = requestBudget;
        if (requestDelivery) request.delivery = requestDelivery;
        request.description = requestDescription;
        request.active = true;
        await request.save({ session });
        await User.updateOne(
          {
            _id: res.locals.user.id,
          },
          {
            $push: { requests: request._id },
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
    const { requestId } = req.params;
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }],
      });
      if (foundRequest) {
        await User.updateOne(
          {
            _id: res.locals.user.id,
          },
          {
            $pull: { requests: requestId },
          }
        ).session(session);

        await Request.deleteOne({
          _id: requestId,
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

const editRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const foundUser = await User.findOne({ _id: res.locals.user.id });
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }],
      });
      if (foundRequest) {
        return res.json({
          request: foundRequest,
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
    const { requestId } = req.params;
    const {
      requestCategory,
      requestBudget,
      requestDelivery,
      requestDescription,
    } = req.body;
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }],
      }).session(session);
      if (foundRequest) {
        if (requestCategory) foundRequest.category = requestCategory;
        if (requestBudget) foundRequest.budget = requestBudget;
        if (requestDelivery) foundRequest.delivery = requestDelivery;
        if (requestDescription) {
          foundRequest.description = requestDescription;
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

const getRequests = async (req, res, next) => {
  try {
    const foundRequests = await Request.find({
      owner: res.locals.user.id,
    }).populate('owner');
    return res.json({ request: foundRequests });
  } catch (err) {
    next(err, res);
  }
};

const getRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const foundRequest = await Request.findOne({
      _id: requestId,
    }).deepPopulate(['offers.buyer', 'offers.seller']);
    if (foundRequest) {
      const offers = [];
      if (foundRequest.offers) {
        foundRequest.offers.forEach(async (offer) => {
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
        offers: offers,
      });
    } else {
      throw createError(400, 'Request not found');
    }
  } catch (err) {
    next(err, res);
  }
};

const getOffers = async (req, res, next) => {
  try {
    const foundOffers = await Offer.find({
      seller: res.locals.user.id,
    }).populate('buyer');
    return res.json({ offers: foundOffers });
  } catch (err) {
    next(err, res);
  }
};

const getOffer = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const foundOffer = await Offer.findOne({ _id: requestId })
      .populate('buyer')
      .populate('seller');
    if (foundOffer) {
      const foundRequest = await Request.findOne({
        owner: offer.buyer,
      }).populate('owner');
      if (foundRequest) {
        return res.json({
          offer: foundOffer,
          request: foundRequest,
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
  editRequest,
  updateRequest,
  getRequests,
  getRequest,
  getOffers,
  getOffer,
};
