$(function() {
  var socket = io();

  $('#order-message-form').submit(function() {
    var input = $('#order-message').val();
    if (input === '') {
      return false;
    } else {
      socket.emit('orderChatTo', { message: input });
      $('#order-message').val('');
      return false;
    }
  });

  socket.on('orderIncomingChat', function(data) {
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
