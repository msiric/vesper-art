import mongoose from 'mongoose';
import { formatAmount } from '../common/helpers.js';
const Schema = mongoose.Schema;

const LicenseSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  fingerprint: String,
  assignee: String,
  company: String,
  type: String,
  active: Boolean,
  price: { type: Number, get: formatAmount },
  created: { type: Date, default: Date.now },
});

LicenseSchema.set('toObject', { getters: true });
LicenseSchema.set('toJSON', { getters: true });

const License = mongoose.model('License', LicenseSchema);

License.createCollection();

export default License;
