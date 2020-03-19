const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  tag: String,
  initiator: { type: Schema.Types.ObjectId, ref: 'User' },
  participant: { type: Schema.Types.ObjectId, ref: 'User' },
  offer: { type: Schema.Types.ObjectId, ref: 'Offer' },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  read: Boolean,
  created: { type: Date, default: Date.now }
});

ConversationSchema.plugin(deepPopulate);

const Conversation = mongoose.model('Conversation', ConversationSchema);

Conversation.createCollection().then(function(collection) {
  console.log('Conversations created');
});

module.exports = Conversation;
