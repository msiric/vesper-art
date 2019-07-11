const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const WorkSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  description: String,
  created: { type: Date, default: Date.now },
  amount: Number,
  delivery: Date,
  status: Number
});

WorkSchema.plugin(deepPopulate);

module.exports = mongoose.model('Work', WorkSchema);