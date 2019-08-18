const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');

const getConversations = async (req, res, next) => {
  // FOR RESET
  /*   const updatedUser = await User.updateOne(
    {
      _id: req.user._id
    },
    { $set: { inbox: 0 } }
  ); */
  try {
    const conversations = await Conversation.find({
      $or: [{ first: req.user._id }, { second: req.user._id }]
    })
      .populate('first')
      .populate('second')
      .deepPopulate('messages.owner');
    res.render('accounts/conversations', { conversations: conversations });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getConversation = async (req, res, next) => {
  // on send show receiver photo, username and last message, handle inbox value on client side when inside the conversation
  try {
    let decreaseInbox = false;
    const userId = req.params.conversationId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const userExists = await User.findOne({
        _id: userId
      });
      if (userExists) {
        req.session.participantId = userId;
        if (userId.localeCompare(req.user._id) === 1) {
          req.session.convoId = userId + req.user._id;
        } else {
          req.session.convoId = req.user._id + userId;
        }
        const conversations = await Conversation.find({
          $or: [{ first: req.user._id }, { second: req.user._id }]
        })
          .populate('first')
          .populate('second')
          .deepPopulate('messages.owner');
        const conversation = await Conversation.findOne({
          tag: req.session.convoId
        })
          .populate('first')
          .populate('second')
          .deepPopulate('messages.owner');
        if (
          conversation &&
          !conversation.read &&
          conversation.second._id.equals(req.user._id)
        ) {
          const updatedConvo = await Conversation.updateOne(
            {
              tag: req.session.convoId
            },
            {
              $set: {
                read: true
              }
            }
          );
          if (updatedConvo) {
            const updatedUser = await User.updateOne(
              {
                _id: req.user._id
              },
              { $inc: { inbox: -1 } }
            );
            decreaseInbox = true;
          }
        }
        res.render('accounts/convo-room', {
          layout: 'convo-chat',
          conversations: conversations,
          conversation: conversation,
          decreaseInbox: decreaseInbox
        });
      } else {
        res.redirect('/conversations');
      }
    } else {
      res.redirect('/conversations');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const newConversation = (req, res, next) => {
  if (!req.params.recipient) {
    res
      .status(422)
      .send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if (!req.body.composedMessage) {
    res.status(422).send({ error: 'Please enter a message.' });
    return next();
  }

  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient]
  });

  conversation.save(function(err, newConversation) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.composedMessage,
      author: req.user._id
    });

    message.save(function(err, newMessage) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({
        message: 'Conversation started!',
        conversationId: conversation._id
      });
      return next();
    });
  });
};

const sendReply = (req, res, next) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.user._id
  });

  reply.save(function(err, sentReply) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ message: 'Reply successfully sent!' });
    return next;
  });
};

module.exports = {
  getConversations,
  getConversation,
  newConversation,
  sendReply
};
