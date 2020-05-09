const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  current: { type: Schema.Types.ObjectId, ref: 'Version' },
  versions: [{ type: Schema.Types.ObjectId, ref: 'Version' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // new
  active: Boolean,
  created: { type: Date, default: Date.now },
});

ArtworkSchema.plugin(deepPopulate);

/* ArtworkSchema.plugin(mongooseAlgolia, {
  appId: 'P9R2R1LI94',
  apiKey: 'a34d14a54aa9d16c44914324bf41076b',
  indexName: 'ArtworkSchema', //The name of the index in Algolia, you can also pass in a function
  selector: 'title _id owner category about personal cover', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  populate: {
    path: 'owner',
    select: 'name'
  },
  defaults: {
    author: 'unknown'
  },

  debug: true // Default: false -> If true operations are logged out in your console
}); */

// Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
// Model.SetAlgoliaSettings({
//   searchableAttributes: ['title', 'owner.name'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });

const Artwork = mongoose.model('Artwork', ArtworkSchema);

Artwork.createCollection();

module.exports = Artwork;
