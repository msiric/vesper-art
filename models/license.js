import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { formatPrice } from "../common/helpers.js";

const LicenseSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  artwork: { type: Schema.Types.ObjectId, ref: "Artwork" },
  fingerprint: String,
  type: String,
  active: Boolean,
  price: { type: Number, get: formatPrice },
  created: { type: Date, default: Date.now },
});

LicenseSchema.set("toObject", { getters: true });
LicenseSchema.set("toJSON", { getters: true });

const License = mongoose.model("License", LicenseSchema);

License.createCollection();

export default License;
