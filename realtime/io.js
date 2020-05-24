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
      console.log(authentication);
      if (!token) {
        socket.disconnect();
        return false;
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });
      const data = jwt.decode(token);
      if (Date.now() >= data.exp * 1000 || !data.active) {
        socket.emit('expiredToken');
        delete socketApi.connections[data.id];
      } else {
        socketApi.connections[data.id] = {
          id: socket.id,
          exp: data.exp,
        };
      }
    } catch (err) {
      console.log(err);
    }
  });
});

// io.use((socket, next) => {
//   let clientId = socket.handshake.headers['Authorization'];
//   console.log('ID', clientId);
//   // if (isValid(clientId)) {
//   //   return next();
//   // }
//   // return next(new Error('authentication error'));
//   return next();
// });

socketApi.sendNotification = (id, data) => {
  const userId = id.toString();
  if (Date.now() < socketApi.connections[userId].exp * 1000)
    io.to(socketApi.connections[userId].id).emit('sendNotification', data);
  else {
    io.to(socketApi.connections[userId].id).emit('expiredToken');
    delete socketApi.connections[data.id];
  }
};

module.exports = socketApi;
