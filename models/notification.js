const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  link: String,
  message: String,
  readBy: [
    {
      readerId: { type: Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
