const mongoose = require('mongoose');
const Review = require('../models/review');
const Notification = require('../models/notification');
const Order = require('../models/order');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const createError = require('http-errors');

// needs transaction (done)
const postReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reviewRating, reviewContent } = req.body;
    const { orderId } = req.params;
    if (reviewRating) {
      const foundOrder = await Order.findOne({
        $and: [{ _id: orderId }, { buyer: res.locals.user.id }],
      })
        .populate('buyer')
        .deepPopulate('artwork.review')
        .session(session);
      if (foundOrder) {
        if (!foundOrder.artwork.review) {
          const newReview = new Review();
          newReview.order = foundOrder._id;
          newReview.artwork = foundOrder.artwork._id;
          newReview.owner = res.locals.user.id;
          newReview.rating = reviewRating;
          if (reviewContent) newReview.content = reviewContent;
          const savedReview = await newReview.save({ session });
          const newRating =
            foundOrder.buyer.rating +
            (
              (newReview.rating - foundOrder.buyer.rating) /
              (foundOrder.buyer.reviews + 1)
            ).toFixed(2);
          // notif
          /*             const seller = foundOrder.details.find((item) =>
            item.artwork.equals(artworkId)
          ).artwork.owner;
          const orderPath = '/orders/' + foundOrder._id;
          let notification = new Notification();
          notification.receivers.push({
            user: seller._id,
            read: false,
          });
          notification.link = orderPath;
          notification.message = `${foundOrder.buyer.name} left a review on your artwork!`;
          notification.read = [];
          await notification.save({ session });  */
          await User.updateOne(
            {
              $and: [{ _id: foundOrder.seller._id }, { active: true }],
            },
            {
              rating: newRating,
              /* $inc: { reviews: 1, notifications: 1 }, */
              $inc: { reviews: 1 },
            }
          ).session(session);
          await Order.updateOne(
            {
              $and: [{ _id: orderId }, { buyer: res.locals.user.id }],
            },
            { review: savedReview._id }
          ).session(session);
          await Artwork.updateOne(
            {
              $and: [{ _id: foundOrder.artwork._id }, { active: true }],
            },
            { $push: { reviews: savedReview._id } }
          ).session(session);
          /*           if (users[seller._id]) {
            users[seller._id].emit('increaseNotif', {});
          } */
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
  postReview,
};
