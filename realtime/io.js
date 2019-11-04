const Work = require('../models/work');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Notification = require('../models/notification');
const mongoose = require('mongoose');

// Join room on route, leave on exit
module.exports = function(io) {
  io.on('connection', function(socket) {
    const user = socket.request.user;
    const workId = socket.request.session.workId;
    const convoId = socket.request.session.convoId;
    const participantId = mongoose.Types.ObjectId(
      socket.request.session.participantId
    );

    console.log('user ' + user.name + ' connected, id: ' + user._id);

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

    socket.on('joinRoom', data => {
      console.log('joined ' + user._id);

      socket.join(convoId);

      socket.on('convoChatTo', async data => {
        io.in(convoId).emit('convoIncomingChat', {
          message: data.message,
          sender: user.name,
          senderImage: user.photo,
          senderId: user._id,
          url: convoId
        });
        const message = new Message();
        message.owner = user._id;
        message.content = data.message;
        message.read = false;
        const savedMessage = await message.save();
        let read = false;
        let notify = false;
        if (
          io.sockets.adapter.rooms[convoId].sockets[users[participantId]] &&
          io.sockets.adapter.rooms[convoId].sockets[users[participantId].id]
        ) {
          read = true;
          notify = false;
        } else {
          read = false;
          notify = true;
        }
        // ne sejva initiator i participant
        const updatedConvo = await Conversation.findOneAndUpdate(
          {
            tag: convoId
          },
          {
            $set: {
              tag: convoId,
              initiator: user._id,
              participant: participantId,
              read: read
            },
            $push: { messages: message._id }
          },
          {
            upsert: true,
            useFindAndModify: false,
            rawResult: true
          }
        );
        if (notify) {
          if (!updatedConvo.lastErrorObject.updatedExisting) {
            notifyRecipient();
          } else if (updatedConvo.value && updatedConvo.value.read) {
            notifyRecipient();
          }
        }
      });
    });

    socket.on('leaveRoom', data => {
      socket.leave(convoId);
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
        users[participantId].emit('increaseInbox', { url: user._id });
      }
    }

    socket.on('disconnect', () => {
      console.log('user ' + user.name + ' disconnected');
      delete users[user._id];
    });
  });
};
