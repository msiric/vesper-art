const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  poster: { type: Schema.Types.ObjectId, ref: 'User' },
  category: String,
  budget: Number,
  delivery: Date,
  description: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
