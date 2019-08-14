const Work = require('../models/work');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const mongoose = require('mongoose');

// Join room on route, leave on exit
module.exports = function(io) {
  io.on('connection', function(socket) {
    users = {};
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

    console.log(users[user._id]);
    console.log(io.sockets.adapter.rooms[convoId].sockets[users[user._id].id]);

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
        console.log('koji mrtvi k se dogada');
        notifyRecipient();
      } else if (updatedConvo.value && updatedConvo.value.read) {
        console.log('koji mrtvi k se dogada 2');
        notifyRecipient();
      }
      console.log('koji mrtvi k se dogada 3');
    });

    async function notifyRecipient() {
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: participantId
        },
        { $inc: { inbox: 1 } },
        { useFindAndModify: false }
      );
      // if (users[participantId]) {
      console.log('koji je sad ovo k');
      console.log(convoId);
      users[participantId].emit('increaseInbox', { url: user._id });
      // }
      console.log('koji je sad ovo k 2');
    }

    socket.on('disconnect', () => {
      console.log('user ' + user.name + ' disconnected');
      delete users[user._id];
    });
  });
};
