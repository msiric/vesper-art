const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  details: [
    {
      seller: { type: Schema.Types.ObjectId, ref: 'User' },
      version: { type: Schema.Types.ObjectId, ref: 'Version' },
      artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
      licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }]
    }
  ],
  discount: { type: Schema.Types.ObjectId, ref: 'Promocode' },
  paid: Number,
  sold: Number,
  status: Number,
  bulk: Boolean,
  created: { type: Date, default: Date.now }
});

OrderSchema.plugin(deepPopulate);

module.exports = mongoose.model('Order', OrderSchema);
