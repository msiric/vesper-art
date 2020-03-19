const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  review: String,
  rating: Number,
  created: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

Review.createCollection().then(function(collection) {
  console.log('Reviews created');
});

module.exports = Review;
