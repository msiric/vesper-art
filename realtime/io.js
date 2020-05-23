const io = require('socket.io')();
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const socketApi = {};

socketApi.io = io;
socketApi.connections = {};

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('authenticateUser', (authentication) => {
    if (!authentication) throw createError(403, 'Forbidden');
    try {
      const token = authentication.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const data = jwt.decode(token);
      socketApi.connections[data.id] = socket.id;
      socket.emit('authenticatedUser');
    } catch (err) {
      console.log(err);
      socket.emit('unauthenticatedUser');
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
  io.to(socketApi.connections[userId]).emit('sendNotification', data);
};

module.exports = socketApi;
