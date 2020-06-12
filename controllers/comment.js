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

const postComment = async (req, res, next) => {
  const { artworkId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = res.locals.user.id;
    const { commentContent } = req.body;
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
      res.json({
        message: 'Comment posted successfully',
        payload: savedComment,
      });
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const patchComment = async (req, res, next) => {
  try {
    const { artworkId, commentId } = req.params;
    const { commentContent } = req.body;
    await editExistingComment({
      commentId,
      artworkId,
      userId: res.locals.user.id,
      commentContent,
    });
    res.json({
      message: 'Comment updated successfully',
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const deleteComment = async (req, res, next) => {
  const { artworkId, commentId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await removeArtworkComment({ artworkId, commentId, session });
    await removeExistingComment({
      commentId,
      artworkId,
      userId: res.locals.user.id,
      session,
    });
    await session.commitTransaction();
    res.json({
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

export default {
  postComment,
  patchComment,
  deleteComment,
};
