const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { email: { $exists: true } },
    },
  },
  name: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { email: { $exists: true } },
    },
  },
  password: String,
  photo: String,
  description: String,
  country: String,
  customWork: Boolean,
  displaySaves: Boolean,
  verificationToken: String,
  verified: Boolean,
  resetToken: String,
  resetExpiry: Date,
  jwtVersion: { type: Number, default: 0 },
  cart: [
    {
      artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
      licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }],
    },
  ],
  discount: { type: Schema.Types.ObjectId, ref: 'Discount' },
  inbox: Number,
  notifications: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  artwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  savedArtwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  purchases: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  sales: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  stripeId: String,
  active: Boolean,
  created: { type: Date, default: Date.now },
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  if (user.password) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(err);
      });
    });
  }
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function (size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

const User = mongoose.model('User', UserSchema);

User.createCollection();

module.exports = User;
