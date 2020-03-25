const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean },
  created: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

Message.createCollection();

module.exports = Message;
