const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  link: String,
  type: String,
  // receivers: [
  //   {
  //     user: { type: Schema.Types.ObjectId, ref: 'User' },
  //     read: Boolean
  //   }
  // ],
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  read: Boolean,
  created: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);

Notification.createCollection();

module.exports = Notification;
