$(function() {
  socket.on('connect', () => {
    socket.emit('leaveRoom', {});
  });
});
