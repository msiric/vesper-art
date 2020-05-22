const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('sendNotification', 'alo');
});

socketApi.sendNotification = () => {
  io.sockets.emit('hello', { msg: 'Hello World!' });
};

module.exports = socketApi;
