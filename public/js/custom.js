$(function() {
  let badge = $('#cart_items')
    .eq(0)
    .html();
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
          $('.order-card .name').append(
            '<a href="/checkout/process_cart" class="btn btn-success space-left" id="in-cart">In cart</a>'
          );
          $('#add-to-cart').remove();
          if (data.warning) {
            $('.service-details-message')
              .addClass('alert alert-danger')
              .html(data.warning);
          } else {
            badge++;
            $('.badge').html(badge);
            $('.service-details-message')
              .addClass('alert alert-success')
              .html(data.message);
          }
        }
      });
    }
  });

  $('.remove-from-cart').on('click', function() {
    let gig_id = $(this).attr('id');
    if (gig_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/remove-from-cart',
        data: {
          gig_id: gig_id
        },
        success: function(data) {
          let subtotal = parseInt($('#subtotal').html());
          subtotal -= data.price;
          if (subtotal === 0) {
            $('.cart').empty();
            $('.cart').html('Cart is empty');
          } else {
            $('#subtotal').html(subtotal);
            $('#totalPrice').html(data.totalPrice);
          }

          badge--;
          $('.badge').html(badge);
          $('#' + gig_id).remove();
          $('.cart-message')
            .addClass('alert alert-success')
            .html(data.message);
          $('.order-card .name').append(
            '<button class="btn btn-success space-left" id="add-to-cart"><i class="fa fa-shopping-cart"></i></button>'
          );
          $('#in-cart').remove();
        }
      });
    }
  });
});

// Facebook ugly url appendix removal
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}
