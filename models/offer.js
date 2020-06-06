import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  budget: Number,
  delivery: Date,
  description: String,
  created: { type: Date, default: Date.now },
});

const Offer = mongoose.model('Offer', OfferSchema);

Offer.createCollection();

export default Offer;
