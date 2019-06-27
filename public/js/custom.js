$(function() {
  let badge = $('#cart_items')
    .eq(0)
    .html();
  $('.cart-promocode-panel').on('click', '#cart-apply-promocode', function() {
    applyPromocode(
      'cart',
      '#cart-promocode-amount',
      '#cart-apply-promocode',
      '.cart-promocode',
      '.cart-promocode-panel',
      '#cart-subtotal',
      '#cart-total'
    );
  });

  $('.package-promocode-panel').on(
    'click',
    '#package-apply-promocode',
    function() {
      applyPromocode(
        'package',
        '#package-promocode-amount',
        '#package-apply-promocode',
        '.package-promocode',
        '.package-promocode-panel',
        '#package-subtotal',
        '#package-total'
      );
    }
  );

  function applyPromocode(type, input, button, layout, panel, subtotal, total) {
    let amount = $(input).val();

    if (amount === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/promocode',
        data: {
          promocode: amount
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
          } else if (data.warningMulti) {
            $('.single-package-message')
              .addClass('alert alert-danger')
              .html(data.warningMulti);
          } else {
            $(button).html('Applied');
            $(button).prop('disabled', true);
            $(layout).remove();
            $(panel).append(
              '<p class="' +
                type +
                '-promocode-text">Discount: ' +
                data.discount +
                '%</p>'
            );
            $(panel).append(
              '<a class="btn btn-danger ' +
                type +
                '-remove-promocode" id="' +
                data.promo +
                '">Remove promo code</a>'
            );
            window.location.reload(true);
          }
        }
      });
    }
  }

  $('.cart-promocode-panel').on('click', '.cart-remove-promocode', function() {
    removePromocode(
      'cart',
      '.cart-remove-promocode',
      '.cart-promocode-text',
      '.cart-remove-promocode',
      '.cart-promocode-panel',
      'cart-promocode-amount',
      'cart-apply-promocode',
      '#cart-subtotal',
      '#cart-total'
    );
  });

  $('.package-promocode-panel').on(
    'click',
    '.package-remove-promocode',
    function() {
      removePromocode(
        'package',
        '.package-remove-promocode',
        '.package-promocode-text',
        '.package-remove-promocode',
        '.package-promocode-panel',
        'package-promocode-amount',
        'package-apply-promocode',
        '#package-subtotal',
        '#package-total'
      );
    }
  );

  function removePromocode(
    type,
    promo,
    text,
    remove,
    panel,
    amount,
    apply,
    subtotal,
    total
  ) {
    let promo_id = $(promo).attr('id');
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
          $(text).remove();
          $(remove).remove();
          $(panel).append(
            '<div class="input-group ' +
              type +
              '-promocode"><input type="text" class="form-control" placeholder="Enter promocode" id="' +
              amount +
              '"><span class="input-group-btn"><button class="btn btn-success btn-block" id="' +
              apply +
              '">Apply</button></span></div>'
          );
          window.location.reload(true);
        }
      });
    }
  }

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
            $('#subtotal').html(parseFloat(data.subtotal.toFixed(12)));
            $('#totalPrice').html(parseFloat(data.totalPrice.toFixed(12)));
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
