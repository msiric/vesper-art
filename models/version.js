const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  /* artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' }, */
  type: String,
  title: String,
  category: String,
  about: String,
  price: Number,
  use: String,
  license: Number,
  available: Boolean,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  created: { type: Date, default: Date.now }
});

const Version = mongoose.model('Version', VersionSchema);

Version.createCollection().then(function(collection) {
  console.log('Versions created');
});

module.exports = Version;
