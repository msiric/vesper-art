const mongoose = require('mongoose');
const Review = require('../models/review');
const Notification = require('../models/notification');
const Order = require('../models/order');
const User = require('../models/user');
const createError = require('http-errors');

// needs transaction (done)
const postReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderId = req.body.orderId;
    const rating = req.body.rating;
    const review = req.body.review;
    const artworkId = req.params.id;
    if (rating) {
      const foundOrder = await Order.findOne({
        $and: [
          { _id: orderId },
          { buyer: req.user._id },
          { details: { $elemMatch: { artwork: artworkId } } }
        ]
      })
        .populate('buyer')
        .deepPopulate('details.artwork.owner')
        .session(session);
      if (foundOrder) {
        const foundReview = await Review.findOne({
          $and: [{ artwork: artworkId }, { owner: req.user._id }]
        }).session(session);
        if (!foundReview) {
          const newReview = new Review();
          newReview.order = foundOrder._id;
          newReview.artwork = artworkId;
          newReview.owner = req.user._id;
          if (review) newReview.review = review;
          newReview.rating = rating;
          await newReview.save({ session });
          const seller = foundOrder.details.find(item =>
            item.artwork.equals(artworkId)
          ).artwork.owner;
          const orderPath = '/orders/' + foundOrder._id;
          let notification = new Notification();
          notification.receivers.push({
            user: seller._id,
            read: false
          });
          notification.link = orderPath;
          notification.message = `${foundOrder.buyer.name} left a review on your artwork!`;
          notification.read = [];
          await notification.save({ session });
          sellerRating = (
            (parseInt(seller.rating) + parseInt(rating)) /
            parseInt(seller.reviews + 1)
          ).toFixed(2);
          await User.updateOne(
            { _id: seller._id },
            {
              rating: sellerRating,
              $inc: { reviews: 1, notifications: 1 }
            }
          ).session(session);
          if (users[seller._id]) {
            users[seller._id].emit('increaseNotif', {});
          }
          await session.commitTransaction();
          return res.status(200).json('Review successfully published');
        } else {
          throw createError(400, 'Review already exists for this artwork');
        }
      } else {
        throw createError(400, 'Review cannot be posted for unbought artwork');
      }
    } else {
      throw createError(400, 'Rating is required');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  postReview
};
