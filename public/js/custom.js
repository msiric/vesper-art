$(function() {
  let badge = $('#cart_items')
    .eq(0)
    .html();
  $('.promocode-panel').on('click', '#promocodeButton', function() {
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
          if (data.warningUnfound) {
            $('.single-package-message')
              .addClass('alert alert-danger')
              .html(data.warningUnfound);
          } else if (data.warningUsed) {
            $('.single-package-message')
              .addClass('alert alert-danger')
              .html(data.warningUsed);
          } else {
            $('#promocodeButton').html('Applied');
            $('#promocodeButton').prop('disabled', true);
            $('.promocode').remove();
            $('.promocode-panel').append(
              '<p class="promocode-amount">Discount: ' + data.discount + '%</p>'
            );
            $('.promocode-panel').append(
              '<a class="btn btn-danger remove-promocode" id="' +
                data.promo +
                '">Remove promo code</a>'
            );
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

$('.promocode-panel').on('click', '.remove-promocode', function() {
  let promo_id = $(this).attr('id');
  if (promo_id === '') {
    return false;
  } else {
    $.ajax({
      type: 'POST',
      url: '/remove-promocode',
      data: {
        promocode: promo_id
      },
      success: function(data) {
        $('.promocode-amount').remove();
        $('.remove-promocode').remove();
        $('.promocode-panel').append(
          '<div class="input-group promocode"><input type="text" class="form-control" placeholder="Enter promocode" id="code"><span class="input-group-btn"><button class="btn btn-success btn-block" id="promocodeButton">Apply</button></span></div>'
        );
        $('#subtotal').html(data.subtotal);
        $('#totalPrice').html(data.newPrice);
      }
    });
  }
});

// Facebook ugly url appendix removal
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}
