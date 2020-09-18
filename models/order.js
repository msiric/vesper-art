import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';
import { formatAmount } from '../common/helpers.js';

const deepPopulate = mongooseDeepPopulate(mongoose);

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  version: { type: Schema.Types.ObjectId, ref: 'Version' },
  license: { type: Schema.Types.ObjectId, ref: 'License' },
  discount: { type: Schema.Types.ObjectId, ref: 'Discount' },
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  spent: { type: Number, get: formatAmount },
  earned: { type: Number, get: formatAmount },
  fee: { type: Number, get: formatAmount },
  commercial: Boolean,
  status: String,
  intent: String,
  created: { type: Date, default: Date.now },
});

OrderSchema.plugin(deepPopulate);

OrderSchema.set('toObject', { getters: true });
OrderSchema.set('toJSON', { getters: true });

const Order = mongoose.model('Order', OrderSchema);

Order.createCollection();

export default Order;
