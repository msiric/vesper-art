const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  first: { type: Schema.Types.ObjectId, ref: 'User' },
  second: { type: Schema.Types.ObjectId, ref: 'User' },
  offer: { type: Schema.Types.ObjectId, ref: 'Offer' },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  created: { type: Date, default: Date.now }
});

ConversationSchema.plugin(deepPopulate);

module.exports = mongoose.model('Conversation', ConversationSchema);
