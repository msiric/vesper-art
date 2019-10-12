const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  type: String,
  title: String,
  category: String,
  about: String,
  price: Number,
  use: String,
  license: Number,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Version', VersionSchema);
