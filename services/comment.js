import mongoose from 'mongoose';
import Comment from '../models/comment.js';

export const createNewComment = async ({
  artworkId,
  userId,
  commentContent,
  session = null,
}) => {
  const comment = new Comment();
  comment.artwork = artworkId;
  comment.owner = userId;
  comment.content = commentContent;
  comment.modified = false;
  return await comment.save({ session });
};

export const updateExistingComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
  session = null,
}) => {
  return await Comment.updateOne(
    {
      $and: [{ _id: commentId }, { artwork: artworkId }, { owner: userId }],
    },
    { content: commentContent, modified: true }
  );
};

export const deleteExistingComment = async ({
  commentId,
  artworkId,
  userId,
  session = null,
}) => {
  return await Comment.deleteOne({
    $and: [{ _id: commentId }, { artwork: artworkId }, { owner: userId }],
  }).session(session);
};
