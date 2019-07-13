const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  budget: Number,
  delivery: Date,
  description: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', OfferSchema);
