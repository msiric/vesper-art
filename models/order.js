const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  // needs testing
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  artwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  created: { type: Date, default: Date.now },
  amount: [Number],
  discount: Boolean,
  paid: Number,
  status: Number,
  bulk: Boolean
});

module.exports = mongoose.model('Order', OrderSchema);
