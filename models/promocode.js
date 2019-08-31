const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromocodeSchema = new Schema({
  name: String,
  discount: Number,
  active: Boolean,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Promocode', PromocodeSchema);
