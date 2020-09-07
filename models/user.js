import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import mongooseDeepPopulate from 'mongoose-deep-populate';
import fuzzySearch from 'mongoose-fuzzy-searching';

const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
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
  height: String,
  width: String,
  description: String,
  country: String,
  origin: String,
  customWork: Boolean,
  displaySaves: Boolean,
  verificationToken: String,
  verified: Boolean,
  resetToken: String,
  resetExpiry: Date,
  jwtVersion: { type: Number, default: 0 },
  inbox: Number,
  notifications: Number,
  rating: Number,
  reviews: Number,
  artwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }], // nesting
  savedArtwork: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }], // nesting
  purchases: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // nesting
  sales: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // nesting
  stripeId: String,
  intents: [
    {
      intentId: String,
      artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork' },
    },
  ],
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

UserSchema.plugin(fuzzySearch, {
  fields: [
    { name: 'name', weight: 3 },
    { name: 'email', weight: 2 },
  ],
});

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

export default User;
