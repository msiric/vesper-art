import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';

const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  tag: String,
  initiator: { type: Schema.Types.ObjectId, ref: 'User' },
  participant: { type: Schema.Types.ObjectId, ref: 'User' },
  offer: { type: Schema.Types.ObjectId, ref: 'Offer' },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  read: Boolean,
  created: { type: Date, default: Date.now },
});

ConversationSchema.plugin(deepPopulate);

const Conversation = mongoose.model('Conversation', ConversationSchema);

Conversation.createCollection();

export default Conversation;
