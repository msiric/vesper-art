const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const Notification = require('../models/notification');
const User = require('../models/user');
const Comment = require('../models/comment');
const auth = require('../utils/auth');
const createError = require('http-errors');
const socketApi = require('../realtime/io');

// needs transaction (not tested)
const postComment = async (req, res, next) => {
  const { artworkId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { commentContent } = req.body;
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).session(session);
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    }).session(session);
    if (!foundArtwork) {
      throw createError(400, 'Artwork not found');
    } else {
      const comment = new Comment();
      comment.artwork = foundArtwork._id;
      comment.owner = res.locals.user.id;
      comment.content = commentContent;
      comment.modified = false;
      const savedComment = await comment.save({ session });
      const updatedArtwork = await Artwork.findOneAndUpdate(
        {
          _id: artworkId,
        },
        { $push: { comments: savedComment._id } },
        { new: true }
      ).session(session);
      await User.updateOne(
        { _id: updatedArtwork.owner },
        { $inc: { notifications: 1 } }
      ).session(session);
      // new start
      const newNotification = new Notification();
      newNotification.link = foundArtwork._id;
      newNotification.type = 'Comment';
      newNotification.receiver = updatedArtwork.owner;
      newNotification.read = false;
      await newNotification.save({ session });
      if (!foundUser._id.equals(updatedArtwork.owner))
        socketApi.sendNotification(updatedArtwork.owner);
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
    const foundComment = await Comment.findOne({
      _id: commentId,
    }).session(session);
    if (!foundComment) {
      throw createError(400, 'Comment not found');
    } else {
      if (foundComment.owner.equals(res.locals.user.id)) {
        const foundArtwork = await Artwork.findOne({
          _id: artworkId,
        }).session(session);
        if (foundArtwork || foundComment.artwork.equals(foundArtwork._id)) {
          foundComment.content = commentContent;
          foundComment.modified = true;
          await foundComment.save({ session });
          // new start
          /*           socketApi.patchComment({
            comment: foundComment,
          }); */
          // new end
          await session.commitTransaction();
          res.json({
            message: 'Comment updated successfully',
          });
        } else {
          throw createError(400, 'Artwork not found');
        }
      } else {
        throw createError(400, 'You are not allowed to modify this comment');
      }
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// delete comment from artwork array (in process)
const deleteComment = async (req, res, next) => {
  const { artworkId, commentId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundComment = await Comment.findOne({
      _id: commentId,
    }).session(session);
    if (!foundComment) {
      throw createError(400, 'Comment not found');
    } else {
      if (foundComment.owner.equals(res.locals.user.id)) {
        const foundArtwork = await Artwork.findOne({
          _id: artworkId,
        }).session(session);
        if (foundArtwork || foundComment.artwork.equals(foundArtwork._id)) {
          await Artwork.updateOne(
            { _id: artworkId },
            { $pull: { comments: commentId } }
          ).session(session);
          await Comment.deleteOne({
            _id: commentId,
          }).session(session);
          // new start
          /*           socketApi.deleteComment({
            comment: foundComment,
          }); */
          // new end
          await session.commitTransaction();
          res.json({
            message: 'Comment deleted successfully',
          });
        } else {
          throw createError(400, 'Artwork not found');
        }
      } else {
        throw createError(400, 'You are not allowed to delete this comment');
      }
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  postComment,
  patchComment,
  deleteComment,
};
