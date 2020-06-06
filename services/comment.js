import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import auth from '../utils/auth.js';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';

export const postComment = async ({ artworkId, commentContent }) => {
  const comment = new Comment();
  comment.artwork = foundArtwork._id;
  comment.owner = res.locals.user.id;
  comment.content = commentContent;
  comment.modified = false;
  return await comment.save({ session });
};

export const patchComment = async ({ commentId, commentContent }) => {
  return await Comment.updateOne(
    { $and: [{ _id: commentId }, { owner: res.locals.user.id }] },
    { content: commentContent, modified: true }
  );
};

export const deleteComment = async ({ commentId }) => {
  return await Comment.deleteOne({
    _id: commentId,
  }).session(session);
};
