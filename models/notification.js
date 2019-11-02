const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  receiver: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  link: String,
  message: String,
  read: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
