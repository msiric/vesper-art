const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LicenseSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  fingerprint: String,
  type: String,
  credentials: String,
  active: Boolean,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('License', LicenseSchema);
