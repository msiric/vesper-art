const User = require('../models/user');
const Work = require('../models/work');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const async = require('async');

module.exports = function(io) {
  io.on('connection', function(socket) {
    const user = socket.request.user;
    const workId = socket.request.session.workId;
    const convoId = socket.request.session.convoId;

    socket.join(workId);

    socket.on('workChatTo', data => {
      async.waterfall([
        function(callback) {
          io.in(workId).emit('workIncomingChat', {
            message: data.message,
            sender: user.name,
            senderImage: user.photo,
            senderId: user._id
          });
          const message = new Message();
          message.owner = user._id;
          message.content = data.message;
          message.read = false;
          message.save(function(err) {
            callback(err, message);
          });
        },

        function(message, callback) {
          Work.update(
            {
              _id: workId
            },
            {
              $push: { messages: message._id }
            },
            function(err, count) {}
          );
        }
      ]);
    });

    socket.join(convoId);

    socket.on('convoChatTo', data => {
      async.waterfall([
        function(callback) {
          io.in(convoId).emit('convoIncomingChat', {
            message: data.message,
            sender: user.name,
            senderImage: user.photo,
            senderId: user._id
          });
          const message = new Message();
          message.owner = user._id;
          message.content = data.message;
          message.read = false;
          message.save(function(err) {
            callback(err, message);
          });
        },

        function(message, callback) {
          Conversation.update(
            {
              _id: convoId
            },
            {
              $push: { messages: message._id }
            },
            function(err, count) {}
          );
        }
      ]);
    });
  });
};
