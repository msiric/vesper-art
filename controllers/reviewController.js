const mongoose = require('mongoose');
const Review = require('../models/review');
const Order = require('../models/order');
const User = require('../models/user');

// needs transaction (done)
const postReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const rating = req.body.rating;
    const review = req.body.review;
    const artworkId = req.params.id;
    if (rating) {
      const foundOrder = await Order.findOne({
        $and: [
          { buyer: req.user._id },
          { details: { $elemMatch: { artwork: artworkId } } }
        ]
      })
        .deepPopulate('details.artwork.owner')
        .session(session);
      if (foundOrder) {
        const foundReview = await Review.findOne({
          artwork: artworkId
        }).session(session);
        if (!foundReview) {
          const newReview = new Review();
          newReview.artwork = artworkId;
          newReview.owner = req.user._id;
          if (review) newReview.review = review;
          newReview.rating = rating;
          const savedReview = await newReview.save({ session });
          if (savedReview) {
            const seller = foundOrder.details.find(item =>
              item.artwork.equals(artworkId)
            ).artwork.owner;
            sellerRating = (
              (parseInt(seller.rating) + parseInt(rating)) /
              parseInt(seller.reviews + 1)
            ).toFixed(2);
            const updatedUser = await User.updateOne(
              { _id: seller._id },
              { rating: sellerRating, $inc: { reviews: 1 } }
            ).session(session);
            if (updatedUser) {
              await session.commitTransaction();
              return res.status(200).json('Review successfully published');
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: 'Could not update user rating' });
            }
          } else {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Could not save review' });
          }
        } else {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: 'Review already exists for this artwork' });
        }
      } else {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: 'Review cannot be posted for unbought artwork' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Rating cannot be empty' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

module.exports = {
  postReview
};
