const User = require('../../models/user');
const Offer = require('../../models/Offer');
const Request = require('../../models/request');

const postRequest = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      if (foundUser.requests && foundUser.requests.length > 0) {
        return res
          .status(400)
          .json({ message: 'You already have an active request' });
      } else {
        let request = new Request();
        request.poster = req.user._id;
        if (req.body.request_category)
          request.category = req.body.request_category;
        if (req.body.request_budget) request.budget = req.body.request_budget;
        if (req.body.request_delivery)
          request.delivery = req.body.request_delivery;
        request.description = req.body.request_description;
        const savedRequest = await request.save();
        if (savedRequest) {
          const updatedUser = await User.update(
            {
              _id: req.user._id
            },
            {
              $push: { requests: request._id }
            }
          );
          if (updatedUser) {
            return res
              .status(200)
              .json({ message: 'Request successfully published' });
          } else {
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Could not publish your request' });
        }
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      if (foundUser.requests.indexOf(requestId) > -1) {
        const updatedUser = await User.update(
          {
            _id: req.user._id
          },
          {
            $pull: { requests: requestId }
          }
        );
        if (updatedUser) {
          const deletedRequest = await Request.deleteOne({ _id: requestId });
          if (deletedRequest) {
            return res
              .status(200)
              .json({ message: 'Request successfully deleted' });
          } else {
            return res
              .status(400)
              .json({ message: 'Could not delete request' });
          }
        } else {
          return res.status(400).json({ message: 'Could not update user' });
        }
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

const getRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      if (foundUser.requests.indexOf(requestId) > -1) {
        const foundRequest = await Request.findOne({ _id: requestId });
        if (foundRequest) {
          return res.status(200).json({ request: foundRequest });
        } else {
          return res.status(400).json({ message: 'Request not found' });
        }
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

const updateRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      if (foundUser.requests.indexOf(requestId) > -1) {
        const foundRequest = await Request.findOne({ _id: requestId });
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
          const savedRequest = await foundRequest.save();
          if (savedRequest) {
            return res
              .status(200)
              .json({ message: 'Request successfully updated' });
          } else {
          }
        } else {
          return res.status(400).json({ message: 'Request not found' });
        }
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

const getUserRequests = async (req, res, next) => {
  try {
    const foundRequests = await Request.find({ poster: req.user._id }).populate(
      'poster'
    );
    return res.status(200).json({ request: foundRequests });
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
        foundRequest.offers.forEach(function(offer) {
          const foundOffer = await Offer.find({ seller: offer.seller })
            .populate('buyer')
            .populate('seller')
            if (foundOffer){
              offers.push(foundOffer)
            }
        });
      }
      return res.status(200).json({ request: foundRequest,
        offers: offers });
    } else{
      return res.status(400).json({ message: 'Request not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserOffers = async (req, res, next) => {
  try{
    const foundOffers = await Offer.find({ seller: req.user._id })
    .populate('buyer')
    return res.status(200).json({ offers: foundOffers });
  } catch(err){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getUserOffer = async (req, res, next) => {
  try{
    const foundOffer = await Offer.findOne({ _id: req.params.offerId })
    .populate('buyer')
    .populate('seller')
    if (foundOffer){
      const foundRequest = await Request.findOne({ poster: offer.buyer })
      .populate('poster')
      if (foundRequest){
        return res.status(200).json({ offer: foundOffer, request: foundRequest });
      } else{
        return res.status(400).json({ message: 'Request not found' });
      }
    } else{
      return res.status(400).json({ message: 'Offer not found' });
    }
  } catch(err){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  postRequest,
  deleteRequest,
  getRequest,
  updateRequest,
  getUserRequests,
  getUserRequest,
  getUserOffers,
  getUserOffer,
};