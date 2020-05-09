const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' }, // new
  type: String,
  title: String,
  category: String,
  description: String,
  license: String,
  use: String,
  price: Number,
  commercial: Number,
  availability: String,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  created: { type: Date, default: Date.now },
});

const Version = mongoose.model('Version', VersionSchema);

Version.createCollection();

module.exports = Version;
