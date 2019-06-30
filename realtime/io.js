const User = require('../models/user');
const Order = require('../models/order');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const async = require('async');

module.exports = function(io) {
  io.on('connection', function(socket) {
    const user = socket.request.user;
    const orderId = socket.request.session.orderId;
    const convoId = socket.request.session.convoId;

    socket.join(orderId);

    socket.on('orderChatTo', data => {
      async.waterfall([
        function(callback) {
          io.in(orderId).emit('orderIncomingChat', {
            message: data.message,
            sender: user.name,
            senderImage: user.photo,
            senderId: user._id
          });
          var message = new Message();
          message.owner = user._id;
          message.content = data.message;
          message.save(function(err) {
            callback(err, message);
          });
        },

        function(message, callback) {
          Order.update(
            {
              _id: orderId
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
          var message = new Message();
          message.owner = user._id;
          message.content = data.message;
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
