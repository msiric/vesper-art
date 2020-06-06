import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';

const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;

const WorkSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  description: String,
  amount: Number,
  delivery: Date,
  status: Number,
  created: { type: Date, default: Date.now },
});

WorkSchema.plugin(deepPopulate);

const Work = mongoose.model('Work', WorkSchema);

Work.createCollection();

export default Work;
