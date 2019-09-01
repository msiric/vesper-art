const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  category: String,
  budget: Number,
  delivery: Date,
  description: String,
  offers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
  created: { type: Date, default: Date.now }
});

RequestSchema.plugin(deepPopulate);

module.exports = mongoose.model('Request', RequestSchema);
