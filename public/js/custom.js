$(function() {
  $('#promocodeButton').on('click', function() {
    let input = $('#code').val();

    if (input === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/promocode',
        data: {
          promocode: input
        },
        success: function(data) {
          if (data === 0) {
            $('#promocodeResponse').html("Code doesn't exist");
          } else {
            console.log(data);
            $('#promocodeButton').html('Applied');
            $('#promocodeButton').prop('disabled', true);
            $('#promocodeResponse').html('Successfully applied');
            $('#subtotal').html(data.subtotal);
            $('#totalPrice').html(data.newPrice);
          }
        }
      });
    }
  });
});
