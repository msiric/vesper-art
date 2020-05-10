const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { formatPrice } = require('../utils/helpers');

const VersionSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  type: String,
  title: String,
  category: String,
  description: String,
  license: String,
  use: String,
  personal: { type: Number, get: formatPrice },
  commercial: { type: Number, get: formatPrice },
  availability: String,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  created: { type: Date, default: Date.now },
});

VersionSchema.set('toObject', { getters: true });
VersionSchema.set('toJSON', { getters: true });

const Version = mongoose.model('Version', VersionSchema);

Version.createCollection();

module.exports = Version;
