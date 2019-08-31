const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  review: String,
  rating: Number,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
