$(function() {
  socket.on('connect', () => {
    socket.emit('joinRoom', {});
  });
});
