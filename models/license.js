const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LicenseSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  fingerprint: String,
  type: String,
  credentials: String,
  active: Boolean,
  price: Number,
  created: { type: Date, default: Date.now }
});

const License = mongoose.model('License', LicenseSchema);

License.createCollection().then(function(collection) {
  console.log('Licenses created');
});

module.exports = License;
