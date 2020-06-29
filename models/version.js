import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import mongooseDeepPopulate from 'mongoose-deep-populate';

const deepPopulate = mongooseDeepPopulate(mongoose);
import fuzzySearch from 'mongoose-fuzzy-searching';
import { formatPrice } from '../utils/helpers.js';

const VersionSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' }, // nesting
  height: String,
  width: String,
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
