const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const Comment = require('../models/comment');
const auth = require('../utils/auth');
const createError = require('http-errors');

// needs transaction (not tested)
const postComment = async (req, res, next) => {
  const { artworkId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ owner: artworkId }, { active: true }],
    }).session(session);
    if (!foundArtwork) {
      throw createError(400, 'Artwork not found');
    } else {
      const comment = new Comment();
      comment.artwork = artworkId;
      comment.owner = res.locals.user.id;
      comment.content = req.body.content;
      comment.modified = false;
      const savedComment = await comment.save({ session });
      foundArtwork.comments.push(savedComment._id);
      await foundArtwork.save({ session });
      await session.commitTransaction();
      res.status(200).json({ message: 'Comment posted successfully' });
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const patchComment = async (req, res, next) => {
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
      if (foundComment.owner !== res.locals.user.id) {
        throw createError(400, 'You are not allowed to modify this comment');
      } else {
        const foundArtwork = await Artwork.findOne({
          _id: artworkId,
        }).session(session);
        if (!foundArtwork || foundComment.artwork !== foundArtwork._id) {
          throw createError(400, 'Artwork not found');
        } else {
          if (req.body.content) foundComment.content = req.body.content;
          foundComment.modified = true;
          await foundComment.save({ session });
          await session.commitTransaction();
        }
      }
    }
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

// delete comment from artwork array (in process)
const deleteComment = async (req, res) => {
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
      if (foundComment.owner !== res.locals.user.id) {
        throw createError(400, 'You are not allowed to delete this comment');
      } else {
        const foundArtwork = await Artwork.findOne({
          _id: artworkId,
        }).session(session);
        if (!foundArtwork || foundComment.artwork !== foundArtwork._id) {
          throw createError(400, 'Artwork not found');
        } else {
          foundArtwork.comments.filter((comment) => comment._id !== commentId);
          await foundArtwork.save({ session });
          await Comment.deleteOne({
            _id: commentId,
          }).session(session);
          await session.commitTransaction();
        }
      }
    }
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

module.exports = {
  postComment,
  patchComment,
  deleteComment,
};
