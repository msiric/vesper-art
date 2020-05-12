const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;
const { formatPrice } = require('../utils/helpers');

const OrderSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  version: { type: Schema.Types.ObjectId, ref: 'Version' },
  licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }],
  discount: { type: Schema.Types.ObjectId, ref: 'Discount' },
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  spent: { type: Number, get: formatPrice },
  earned: { type: Number, get: formatPrice },
  fee: { type: Number, get: formatPrice },
  status: String,
  intent: String,
  created: { type: Date, default: Date.now },
});

OrderSchema.set('toObject', { getters: true });
OrderSchema.set('toJSON', { getters: true });

OrderSchema.plugin(deepPopulate);

const Order = mongoose.model('Order', OrderSchema);

Order.createCollection();

module.exports = Order;
