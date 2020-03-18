const mongoose = require('mongoose');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const createError = require('http-errors');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ initiator: req.user._id }, { participant: req.user._id }]
    })
      .populate('initiator')
      .populate('participant')
      .deepPopulate('messages.owner');
    res.render('accounts/conversations', { conversations: conversations });
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const getConversation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  // on send show receiver photo, username and last message, handle inbox value on client side when inside the conversation
  try {
    let decreaseInbox = false;
    const userId = req.params.conversationId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const userExists = await User.findOne({
        _id: userId
      }).session(session);
      if (userExists) {
        req.session.participantId = userId;
        if (userId.localeCompare(req.user._id) === 1) {
          req.session.convoId = userId + req.user._id;
        } else {
          req.session.convoId = req.user._id + userId;
        }
        const conversations = await Conversation.find({
          $or: [{ initiator: req.user._id }, { participant: req.user._id }]
        })
          .populate('initiator')
          .populate('participant')
          .deepPopulate('messages.owner')
          .session(session);
        const conversation = await Conversation.findOne({
          tag: req.session.convoId
        })
          .populate('initiator')
          .populate('participant')
          .deepPopulate('messages.owner')
          .session(session);
        if (
          conversation &&
          !conversation.read &&
          conversation.participant &&
          conversation.participant._id.equals(req.user._id)
        ) {
          await Conversation.updateOne(
            {
              tag: req.session.convoId
            },
            {
              $set: {
                read: true
              }
            }
          ).session(session);
          await User.updateOne(
            {
              _id: req.user._id
            },
            { $inc: { inbox: -1 } }
          ).session(session);
          decreaseInbox = true;
        }
        await session.commitTransaction();
        res.render('accounts/convo-room', {
          layout: 'convo-chat',
          conversations: conversations,
          conversation: conversation,
          decreaseInbox: decreaseInbox
        });
      } else {
        throw createError(400, 'User not found');
      }
    } else {
      throw createError(400, 'Invalid parameter');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const newConversation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.params.recipient) {
      throw createError(400, 'Invalid parameter');
    }

    if (!req.body.composedMessage) {
      throw createError(400, 'Message cannot be empty');
    }

    const conversation = new Conversation();

    conversation.initiator = req.user._id;
    conversation.participant = req.params.recipient;

    const savedConversation = await conversation.save({ session });

    const message = new Message();

    message.conversationId = savedConversation._id;
    body = req.body.composedMessage;
    author = req.user._id;

    await message.save({ session });

    await session.commitTransaction();
    return res.status(200).json({
      conversationId: savedConversation._id
    });
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const sendReply = async (req, res, next) => {
  try {
    const message = new Message();

    message.conversationId = req.params.conversationId;
    message.body = req.body.composedMessage;
    message.author = req.user._id;
    await message.save();
    return res.status(200).json({ message: 'Reply successfully sent!' });
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  getConversations,
  getConversation,
  newConversation,
  sendReply
};
