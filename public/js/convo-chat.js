$(function() {
  var socket = io();
  const id = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );

  $('#convo-message-form').submit(function(e) {
    e.preventDefault();
    var input = $('#convo-message').val();
    if (input === '') {
      return false;
    } else {
      /* socket.emit('join', { user: id }); */
      socket.emit('convoChatTo', { message: input });
      $('#convo-message').val('');
      return false;
    }
  });

  socket.on('convoIncomingChat', function(data) {
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
    $('#order-messages').scrollTop($('#order-messages')[0].scrollHeight);
    $('.no-messages').hide();
  });
});

$('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
