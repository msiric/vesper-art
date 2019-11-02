const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  link: String,
  message: String,
  receivers: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      read: Boolean
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
