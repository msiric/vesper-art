import mongoose from 'mongoose';
import createError from 'http-errors';
import {
  fetchArtworkById,
  addArtworkComment,
  removeArtworkComment,
} from '../services/artwork.js';
import {
  addNewComment,
  editExistingComment,
  removeExistingComment,
} from '../services/comment.js';
import { addUserNotification } from '../services/user.js';
import { addNewNotification } from '../services/notification.js';
import socketApi from '../realtime/io.js';

const postComment = async ({ userId, artworkId, commentContent, session }) => {
  const foundArtwork = await fetchArtworkById({ artworkId, session });
  if (!foundArtwork) {
    throw createError(400, 'Artwork not found');
  } else {
    const savedComment = await addNewComment({
      artworkId,
      userId,
      commentContent,
      session,
    });
    const updatedArtwork = await addArtworkComment({
      artworkId,
      commentId: savedComment._id,
      session,
    });
    await addUserNotification({ userId: updatedArtwork.owner, session });
    if (!savedComment.owner.equals(updatedArtwork.owner)) {
      await addNewNotification({
        notificationLink: foundArtwork._id,
        notificationType: 'Comment',
        notificationReceiver: updatedArtwork.owner,
        session,
      });
      socketApi.sendNotification(updatedArtwork.owner);
    }
    // new start
    /*       socketApi.postComment({
        user: foundUser,
        comment: savedComment,
      }); */
    // new end
    await session.commitTransaction();
    return {
      message: 'Comment posted successfully',
      payload: savedComment,
    };
  }
};

const patchComment = async ({
  userId,
  artworkId,
  commentId,
  commentContent,
}) => {
  await editExistingComment({
    commentId,
    artworkId,
    userId,
    commentContent,
  });
  return { message: 'Comment updated successfully' };
};

const deleteComment = async ({ userId, artworkId, commentId, session }) => {
  await removeArtworkComment({ artworkId, commentId, session });
  await removeExistingComment({
    commentId,
    artworkId,
    userId,
    session,
  });
  return { message: 'Comment deleted successfully' };
};

export default {
  postComment,
  patchComment,
  deleteComment,
};
