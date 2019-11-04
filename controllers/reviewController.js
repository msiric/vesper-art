const mongoose = require('mongoose');
const Review = require('../models/review');
const Order = require('../models/order');
const User = require('../models/user');

const postReview = async (req, res, next) => {
  try {
    const rating = req.body.rating;
    const review = req.body.review;
    const artworkId = req.params.id;
    let sellerId;
    let sellerRating;
    let sellerReviews;
    if (rating) {
      const foundOrder = await Order.find({
        $and: [{ buyer: req.user._id }, { artwork: artworkId }]
      });
      if (foundOrder) {
        const foundReview = await Review.findOne({ artwork: artworkId });
        if (!foundReview) {
          const newReview = new Review();
          newReview.artwork = artworkId;
          newReview.owner = req.user._id;
          if (review) newReview.review = review;
          newReview.rating = rating;
          const savedReview = await newReview.save();
          if (savedReview) {
            foundOrder[0].artwork.map(async function(artwork, index) {
              if (artworkId == artwork) {
                sellerId = foundOrder[0].seller[index];
              }
            });
            if (sellerId) {
              const foundUser = await User.findOne({ _id: sellerId });
              if (foundUser) {
                sellerRating = foundUser.rating;
                sellerReviews = foundUser.reviews;
                if (sellerReviews == 0) {
                  sellerRating = rating;
                  sellerReviews = 1;
                } else {
                  sellerReviews++;
                  sellerRating = (
                    (parseInt(sellerRating) + parseInt(rating)) /
                    parseInt(sellerReviews)
                  )
                    .toFixed(2)
                    .replace(/[.,]00$/, '');
                }
                const updatedUser = await User.updateOne(
                  { _id: sellerId },
                  { rating: sellerRating, reviews: sellerReviews }
                );
                if (updatedUser) {
                  return res.status(200).json('Review successfully published');
                } else {
                  return res
                    .status(400)
                    .json({ message: 'Could not update user rating' });
                }
              } else {
                return res.status(400).json({ message: 'Seller not found' });
              }
            } else {
              return res.status(400).json({ message: 'Seller not found' });
            }
          } else {
            return res.status(400).json({ message: 'Could not save review' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Review already exists for this artwork' });
        }
      } else {
        return res
          .status(400)
          .json({ message: 'Review cannot be posted for unbought artwork' });
      }
    } else {
      return res.status(400).json({ message: 'Rating cannot be empty' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postReview
};
