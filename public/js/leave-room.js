$(function() {
  socket.emit('leaveRoom', {
    userId: socket.id
  });
});
