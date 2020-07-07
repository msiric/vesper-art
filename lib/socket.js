import ioLib from 'socket.io';
import jwt from 'jsonwebtoken';

const io = ioLib();
const socketApi = {};

socketApi.io = io;
socketApi.connections = {};

io.on('connection', (socket) => {
  socket.on('authenticateUser', (authentication) => {
    try {
      const token = authentication ? authentication.split(' ')[1] : null;
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
  socket.on('disconnect', (socket) => {});
});

socketApi.sendNotification = (id) => {
  const userId = id.toString();
  if (socketApi.connections[userId]) {
    if (Date.now() < socketApi.connections[userId].exp * 1000)
      io.to(socketApi.connections[userId].id).emit('sendNotification');
    else io.to(socketApi.connections[userId].id).emit('expiredToken');
  }
};

export default socketApi;
