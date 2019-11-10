const mongoose = require('mongoose');
const User = require('../models/user');
const Offer = require('../models/offer');
const Request = require('../models/request');

// needs transaction (done)
const postRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: req.user._id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.find({
        $and: [{ owner: foundUser._id }, { active: true }]
      });
      if (!foundRequest.length) {
        let request = new Request();
        request.owner = req.user._id;
        if (req.body.request_category)
          request.category = req.body.request_category;
        if (req.body.request_budget) request.budget = req.body.request_budget;
        if (req.body.request_delivery)
          request.delivery = req.body.request_delivery;
        request.description = req.body.request_description;
        request.active = true;
        const savedRequest = await request.save({ session });
        if (savedRequest) {
          const updatedUser = await User.update(
            {
              _id: req.user._id
            },
            {
              $push: { requests: request._id }
            }
          ).session(session);
          if (updatedUser) {
            await session.commitTransaction();
            return res.redirect('/');
          } else {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: 'Could not publish your request' });
        }
      } else {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: 'You already have an active request' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
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
    const foundUser = await User.findOne({ _id: req.user._id }).session(
      session
    );
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }]
      });
      if (foundRequest) {
        const updatedUser = await User.update(
          {
            _id: req.user._id
          },
          {
            $pull: { requests: requestId }
          }
        ).session(session);
        if (updatedUser) {
          const deletedRequest = await Request.deleteOne({
            _id: requestId
          }).session(session);
          if (deletedRequest) {
            await session.commitTransaction();
            return res.redirect('/');
          } else {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ message: 'Could not delete request' });
          }
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Request not found' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

const getRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      const foundRequest = await Request.findOne({
        $and: [{ _id: requestId }, { active: true }]
      });
      if (foundRequest) {
        return res.render('request/request-details', {
          request: foundRequest
        });
      } else {
        return res.status(400).json({ message: 'Request not found' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// needs transaction (not tested)
const updateRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: req.user._id }).session(
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
        const savedRequest = await foundRequest.save({ session });
        if (savedRequest) {
          await session.commitTransaction();
          return res.redirect('/requests');
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Could not save request' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Request not found' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

const getUserRequests = async (req, res, next) => {
  try {
    const foundRequests = await Request.find({ owner: req.user._id }).populate(
      'owner'
    );
    return res.render('request/requests', { request: foundRequests });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserRequest = async (req, res, next) => {
  try {
    const foundRequest = await Request.findOne({
      _id: req.params.requestId
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
      return res.render('request/request-details', {
        request: foundRequest,
        offers: offers
      });
    } else {
      return res.status(400).json({ message: 'Request not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserOffers = async (req, res, next) => {
  try {
    const foundOffers = await Offer.find({ seller: req.user._id }).populate(
      'buyer'
    );
    return res.render('offer/offers', { offers: foundOffers });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserOffer = async (req, res, next) => {
  try {
    const foundOffer = await Offer.findOne({ _id: req.params.offerId })
      .populate('buyer')
      .populate('seller');
    if (foundOffer) {
      const foundRequest = await Request.findOne({
        owner: offer.buyer
      }).populate('owner');
      if (foundRequest) {
        return res.render('offer/offer-details', {
          offer: foundOffer,
          request: foundRequest
        });
      } else {
        return res.status(400).json({ message: 'Request not found' });
      }
    } else {
      return res.status(400).json({ message: 'Offer not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
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
