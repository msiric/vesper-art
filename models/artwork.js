const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  type: String,
  title: String,
  category: String,
  about: String,
  price: Number,
  license: Number,
  cover: { type: String, default: 'http://placehold.it/350x150' },
  media: String,
  active: Boolean,
  created: { type: Date, default: Date.now }
});

/* ArtworkSchema.plugin(mongooseAlgolia, {
  appId: 'P9R2R1LI94',
  apiKey: 'a34d14a54aa9d16c44914324bf41076b',
  indexName: 'ArtworkSchema', //The name of the index in Algolia, you can also pass in a function
  selector: 'title _id owner category about price cover', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  populate: {
    path: 'owner',
    select: 'name'
  },
  defaults: {
    author: 'unknown'
  },

  debug: true // Default: false -> If true operations are logged out in your console
}); */

let Model = mongoose.model('Artwork', ArtworkSchema);

// Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
// Model.SetAlgoliaSettings({
//   searchableAttributes: ['title', 'owner.name'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });

module.exports = Model;
