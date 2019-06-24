$(function() {
  let badge = $('#cart_items')
    .eq(0)
    .html();
  console.log(badge);
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

  $('#add-to-cart').on('click', function() {
    let gig_id = $('#gig_id').val();

    if (gig_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/add-to-cart',
        data: {
          gig_id: gig_id
        },
        success: function(data) {
          badge++;
          $('.badge').html(badge);
          $('#code')
            .addClass('alert alert-success')
            .html(data);
        }
      });
    }
  });
});
