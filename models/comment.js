const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  artwork: { type: Schema.Types.ObjectId, ref: 'Artwork' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  modified: Boolean,
  created: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

Comment.createCollection();

module.exports = Comment;
