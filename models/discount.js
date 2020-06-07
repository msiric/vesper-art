import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// delete if nesting applied

const DiscountSchema = new Schema({
  name: String,
  discount: Number,
  active: Boolean,
  created: { type: Date, default: Date.now },
});

const Discount = mongoose.model('Discount', DiscountSchema);

Discount.createCollection();

export default Discount;
