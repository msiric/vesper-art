$(function() {
  var socket = io();

  $('#work-message-form').submit(function() {
    var input = $('#work-message').val();
    if (input === '') {
      return false;
    } else {
      socket.emit('workChatTo', { message: input });
      $('#work-message').val('');
      return false;
    }
  });

  socket.on('workIncomingChat', function(data) {
    var userId = $('#userId').val();
    var html = '';
    if (data.senderId === userId) {
      html += '<div class="message right">';
      html += '<span class="pic"><img src="' + data.senderImage + '"/></span>';
      html += '<div class="bubble right">';
      html += '<p> ' + data.message + '</p>';
      html += '</div></div>';
    } else {
      html += '<div class="message left">';
      html += '<span class="pic"><img src="' + data.senderImage + '"/></span>';
      html += '<div class="bubble left">';
      html += '<p> ' + data.message + '</p>';
      html += '</div></div>';
    }

    $('.chat-messages').append(html);
    $('#work-messages').scrollTop($('#work-messages')[0].scrollHeight);
    $('.no-messages').hide();
  });
});

$('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
