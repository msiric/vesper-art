$(function() {
  socket.emit('joinRoom', {
    receiverId: window.location.pathname.split('/').pop()
  });
});
