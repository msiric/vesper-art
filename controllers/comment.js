import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import auth from '../utils/auth.js';
import createError from 'http-errors';
import { fetchArtworkById, addArtworkComment } from '../services/artwork.js';
import { fetchUserById, addUserNotification } from '../services/user.js';
import {
  createNewComment,
  updateExistingComment,
} from '../services/comment.js';
import socketApi from '../realtime/io.js';

const postComment = async (req, res, next) => {
  const { artworkId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = res.locals.user.id;
    const { commentContent } = req.body;
    const foundArtwork = await fetchArtworkById({ artworkId });
    if (!foundArtwork) {
      throw createError(400, 'Artwork not found');
    } else {
      const savedComment = await createNewComment({
        artworkId,
        userId,
        commentContent,
      });
      const updatedArtwork = await addArtworkComment({
        artworkId,
        commentId: savedComment._id,
      });
      await addUserNotification({ userId: updatedArtwork.owner });
      if (!userId.equals(updatedArtwork.owner)) {
        await createNewNotification({
          notificationLink: foundArtwork._id,
          notificationType: 'Comment',
          notificationReceiver: updatedArtwork.owner,
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
      res.status(200).json({
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
  const { artworkId, commentId } = req.params;
  const { commentContent } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await updateExistingComment({
      commentId,
      artworkId,
      userId: res.locals.user.id,
      commentContent,
    });
    await session.commitTransaction();
    res.json({
      message: 'Comment updated successfully',
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const deleteComment = async (req, res, next) => {
  const { artworkId, commentId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await deleteArtworkComment({ artworkId, commentId });
    await deleteExistingComment({
      commentId,
      artworkId,
      userId: res.locals.user.id,
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
