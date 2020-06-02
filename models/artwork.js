const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  current: { type: Schema.Types.ObjectId, ref: 'Version' },
  versions: [{ type: Schema.Types.ObjectId, ref: 'Version' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  saves: Number,
  active: Boolean,
  created: { type: Date, default: Date.now },
});

ArtworkSchema.plugin(deepPopulate);

const Artwork = mongoose.model('Artwork', ArtworkSchema);

Artwork.createCollection();

module.exports = Artwork;
