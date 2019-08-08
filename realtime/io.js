const Work = require('../models/work');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const mongoose = require('mongoose');

module.exports = function(io) {
  const users = {};
  io.on('connection', function(socket) {
    const user = socket.request.user;
    const workId = socket.request.session.workId;
    const convoId = socket.request.session.convoId;
    const participantId = mongoose.Types.ObjectId(
      socket.request.session.participantId
    );

    console.log('user ' + user.name + ' connected');

    users[user._id] = socket;

    socket.join(workId);

    socket.on('workChatTo', async data => {
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
      const savedMessage = await message.save();

      const updatedWork = await Work.update(
        {
          _id: workId
        },
        {
          $push: { messages: message._id }
        }
      );
    });

    socket.join(convoId);

    socket.on('convoChatTo', async data => {
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
      const savedMessage = await message.save();
      const updatedConvo = await Conversation.findOneAndUpdate(
        {
          tag: convoId
        },
        {
          $set: {
            tag: convoId,
            first: user._id,
            second: participantId,
            read: false
          },
          $push: { messages: message._id }
        },
        {
          upsert: true,
          useFindAndModify: false,
          rawResult: true
        }
      );

      if (!updatedConvo.lastErrorObject.updatedExisting) {
        notifyRecipient();
      } else if (updatedConvo.value && updatedConvo.value.read) {
        notifyRecipient();
      }
    });

    async function notifyRecipient() {
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: participantId
        },
        { $inc: { inbox: 1 } },
        { useFindAndModify: false }
      );
      if (users[participantId]) {
        users[participantId].emit('increaseInbox', {});
      }
    }

    socket.on('convoRead', () => {
      console.log('in');
      users[user._id].emit('decreaseInbox', {});
    });

    socket.on('disconnect', () => {
      console.log('user ' + user.name + ' disconnected');
      delete users[user._id];
    });
  });
};
