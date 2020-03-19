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
      partialFilterExpression: { email: { $exists: true } }
    }
  },
  name: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { email: { $exists: true } }
    }
  },
  password: String,
  photo: String,
  about: String,
  facebookId: String,
  googleId: String,
  customWork: Boolean,
  secretToken: String,
  verified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  cart: [
    {
      artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
      licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }]
    }
  ],
  discount: { type: Schema.Types.ObjectId, ref: 'Promocode' },
  inbox: Number,
  notifications: Number,
  rating: Number,
  reviews: Number,
  savedArtwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  earnings: Number,
  incomingFunds: Number,
  outgoingFunds: Number,
  active: Boolean
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  if (user.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(err);
      });
    });
  }
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

const User = mongoose.model('User', UserSchema);

User.createCollection().then(function(collection) {
  console.log('Users created');
});

module.exports = User;
