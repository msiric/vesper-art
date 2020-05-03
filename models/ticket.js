const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  attachment: String,
  resolved: Boolean,
  created: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', TicketSchema);

Ticket.createCollection();

module.exports = Ticket;
