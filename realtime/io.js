const io = require('socket.io')();
const jwt = require('jsonwebtoken');
const socketApi = {};

socketApi.io = io;
socketApi.connections = {};

io.on('connection', (socket) => {
  console.log('A user connected');
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

socketApi.sendNotification = (id, data) => {
  const userId = id.toString();
  io.to(socketApi.connections[userId].id).emit('sendNotification', data);
};

module.exports = socketApi;
