import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';
import fuzzySearch from 'mongoose-fuzzy-searching';
import { formatAmount } from '../common/helpers.js';

const deepPopulate = mongooseDeepPopulate(mongoose);

const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' }, // nesting
  orientation: String,
  dominant: String,
  height: String,
  width: String,
  type: String,
  title: String,
  category: String,
  description: String,
  license: String,
  use: String,
  personal: { type: Number, get: formatAmount },
  commercial: { type: Number, get: formatAmount },
  availability: String,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  created: { type: Date, default: Date.now },
});

VersionSchema.set('toObject', { getters: true });
VersionSchema.set('toJSON', { getters: true });

VersionSchema.plugin(deepPopulate);

VersionSchema.plugin(fuzzySearch, {
  fields: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 1 },
  ],
});

const Version = mongoose.model('Version', VersionSchema);

Version.createCollection();

export default Version;
