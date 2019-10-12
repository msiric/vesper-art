const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  // needs restructuring
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  /*   seller: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  artwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  amount: [Number], */
  details: [
    {
      seller: { type: Schema.Types.ObjectId, ref: 'User' },
      artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
      licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }]
    }
  ],
  discount: Boolean,
  paid: Number,
  sold: Number,
  status: Number,
  bulk: Boolean,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
