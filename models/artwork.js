import mongoose from "mongoose";
import mongooseDeepPopulate from "mongoose-deep-populate";

const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  current: { type: Schema.Types.ObjectId, ref: "Version" }, // nesting
  versions: [{ type: Schema.Types.ObjectId, ref: "Version" }], // nesting
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // nesting
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // nesting
  saves: Number,
  generated: Boolean,
  active: Boolean,
  created: { type: Date, default: Date.now },
});

ArtworkSchema.plugin(deepPopulate);

const Artwork = mongoose.model("Artwork", ArtworkSchema);

Artwork.createCollection();

export default Artwork;
