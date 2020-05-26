const io = require('socket.io')();
const jwt = require('jsonwebtoken');
const socketApi = {};

socketApi.io = io;
socketApi.connections = {};

io.on('connection', (socket) => {
  socket.on('authenticateUser', (authentication) => {
    try {
      const token = authentication.split(' ')[1];
      if (!token) {
        socket.disconnect();
        return false;
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const data = jwt.decode(token);
      socketApi.connections[data.id] = {
        id: socket.id,
        exp: data.exp,
      };
    } catch (err) {
      console.log(err);
    }
  });
});

socketApi.sendNotification = (id) => {
  const userId = id.toString();
  if (socketApi.connections[userId]) {
    if (Date.now() < socketApi.connections[userId].exp * 1000)
      io.to(socketApi.connections[userId].id).emit('sendNotification');
    else io.to(socketApi.connections[userId].id).emit('expiredToken');
  }
};

socketApi.postComment = (data) => {
  io.emit('postComment', data);
};

socketApi.patchComment = (data) => {
  io.emit('patchComment', data);
};

socketApi.deleteComment = (data) => {
  io.emit('deleteComment', data);
};

socketApi.postReview = (id, data) => {
  const userId = id.toString();
  if (socketApi.connections[userId]) {
    if (Date.now() < socketApi.connections[userId].exp * 1000)
      io.to(socketApi.connections[userId].id).emit('postReview', data);
    else io.to(socketApi.connections[userId].id).emit('expiredToken');
  }
};

module.exports = socketApi;
