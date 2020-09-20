import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';

const deepPopulate = mongooseDeepPopulate(mongoose);

const Schema = mongoose.Schema;

// delete if nesting applied

const ReviewSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  created: { type: Date, default: Date.now },
});

ReviewSchema.plugin(deepPopulate);

const Review = mongoose.model('Review', ReviewSchema);

Review.createCollection();

export default Review;
