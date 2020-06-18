import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';

const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;
import { formatPrice } from '../utils/helpers.js';

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

export default Order;
