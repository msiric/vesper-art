const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  artwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  buyer: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  buyerText: String,
  buyerRating: Number,
  buyerPosted: { type: Date, default: Date.now },
  seller: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sellerText: String,
  sellerRating: Number,
  sellerPosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
