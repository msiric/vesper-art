const Conversation = require('../models/conversation');
const Message = require('../models/message');

const getConversations = async (req, res, next) => {
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
  const userId = req.params.conversationId;
  if (userId.localeCompare(req.user._id) === 1) {
    req.session.convoId = userId + req.user._id;
    console.log(req.session.convoId);
  } else {
    req.session.convoId = req.user._id + userId;
    console.log(req.session.convoId);
  }
  try {
    const conversations = await Conversation.find({
      $or: [{ first: req.user._id }, { second: req.user._id }]
    })
      .populate('first')
      .populate('second')
      .deepPopulate('messages.owner');
    const conversation = await Conversation.find({
      $and: [
        { $or: [{ first: req.user._id }, { second: userId }] },
        { $or: [{ first: userId }, { second: req.user._id }] }
      ]
    })
      .populate('first')
      .populate('second')
      .deepPopulate('messages.owner');
    res.render('accounts/convo-room', {
      layout: 'convo-chat',
      conversations: conversations,
      conversation: conversation[0]
    });
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
