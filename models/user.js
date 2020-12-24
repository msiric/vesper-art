import mongoose from "mongoose";
import mongooseDeepPopulate from "mongoose-deep-populate";
import fuzzySearch from "mongoose-fuzzy-searching";

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
  orientation: String,
  dominant: String,
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
  artwork: [{ type: Schema.Types.ObjectId, ref: "Artwork" }], // nesting
  savedArtwork: [{ type: Schema.Types.ObjectId, ref: "Artwork" }], // nesting
  purchases: [{ type: Schema.Types.ObjectId, ref: "Order" }], // nesting
  sales: [{ type: Schema.Types.ObjectId, ref: "Order" }], // nesting
  stripeId: String,
  intents: [
    {
      intentId: String,
      versionId: { type: Schema.Types.ObjectId, ref: "Version" },
    },
  ],
  generated: Boolean,
  active: Boolean,
  created: { type: Date, default: Date.now },
});

UserSchema.plugin(deepPopulate);

UserSchema.plugin(fuzzySearch, {
  fields: [
    { name: "name", weight: 3 },
    { name: "email", weight: 2 },
  ],
});

const User = mongoose.model("User", UserSchema);

User.createCollection();

export default User;
