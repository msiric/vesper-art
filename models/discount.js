import mongoose from 'mongoose';
import { formatAmount } from '../common/helpers.js';
const Schema = mongoose.Schema;

// delete if nesting applied

const DiscountSchema = new Schema({
  name: String,
  discount: { type: Number, get: formatAmount },
  active: Boolean,
  created: { type: Date, default: Date.now },
});

DiscountSchema.set('toObject', { getters: true });
DiscountSchema.set('toJSON', { getters: true });

const Discount = mongoose.model('Discount', DiscountSchema);

Discount.createCollection();

export default Discount;
