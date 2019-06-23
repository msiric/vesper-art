$(function() {
  let socket = io();

  $('#sendMessage').submit(function() {
    let input = $('#message').val();
    if (input === '') {
      return false;
    } else {
      socket.emit('chatTo', { message: input });
      $('#message').val('');
      return false;
    }
  });

  socket.on('incomingChat', function(data) {
    let userId = $('#userId').val();
    let html = '';
    if (data.senderId === userId) {
      html += '<div class="message right">';
      html += '<span class="pic"><img src="' + data.senderImage + '"/></span>';
      html += 'div class="bubble right">';
      html += '<p> ' + data.message + '</p>';
      html += '</div></div>';
    } else {
      html += '<div class="message left">';
      html += '<span class="pic"><img src="' + data.senderImage + '"/></span>';
      html += 'div class="bubble left">';
      html += '<p> ' + data.message + '</p>';
      html += '</div></div>';
    }

    $('.chat-mgsg').append(html);
    $('#chatMsgs').scrollTop($('#chatMsgs')[0].scrollHeight);
  });
});
