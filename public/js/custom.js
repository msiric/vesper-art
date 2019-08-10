let socket = null;
$(function() {
  socket = io();

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
    let artwork_id = $('#artwork_id').val();

    if (artwork_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/add-to-cart',
        data: {
          artwork_id: artwork_id
        },
        success: function(data) {
          $('.order-card .name').append(
            '<a href="/checkout/process_cart" class="btn btn-success" id="in-cart">In cart</a>'
          );
          $('#add-to-cart').remove();
          if (data.warning) {
            $('.service-details-message')
              .addClass('alert alert-danger')
              .html(data.warning);
          } else {
            badge++;
            $('.cart-badge').html(badge);
            $('.service-details-message')
              .addClass('alert alert-success')
              .html(data.message);
          }
        }
      });
    }
  });

  $('.remove-from-cart').on('click', function() {
    let artwork_id = $(this).attr('id');
    if (artwork_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'DELETE',
        url: '/remove-from-cart',
        data: {
          artwork_id: artwork_id
        },
        success: function(data) {
          if (data.success) {
            window.location.reload();
          }
        }
      });
    }
  });

  $('#profile-photo-upload').on('change', function() {
    const fileInput = $('#profile-photo-upload')[0];
    const file = fileInput.files[0];
    const imageType = /image.*/;
    if (file) {
      if (!file.type.match(imageType)) {
        return false;
      }

      const formData = new FormData();
      formData.append('image', file);
      if (formData) {
        $.ajax({
          type: 'POST',
          url: '/profile-image-upload',
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          success: function(data) {
            $('#profile-photo').attr('src', data.imageUrl);
            $('#profile-nav-photo').attr('src', data.imageUrl);
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    }
  });

  $('#artwork-upload-form').on('submit', function(e) {
    e.preventDefault();
    const fileInput = $('#artwork-cover-upload')[0];
    const file = fileInput.files[0];
    const imageType = /image.*/;
    if (file) {
      if (!file.type.match(imageType)) {
        return false;
      }

      const formData = new FormData();
      formData.append('image', file);
      if (formData) {
        $.ajax({
          type: 'POST',
          url: '/artwork-cover-upload',
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          success: function(data) {
            const artwork_cover = data.imageUrl;
            const artwork_title = $('input[name=artwork_title]').val();
            const artwork_category = $('select[name=artwork_category]').val();
            const artwork_about = $('textarea[name=artwork_about]').val();
            const artwork_price = $('input[name=artwork_price]').val();
            $.ajax({
              type: 'POST',
              url: '/add-new-artwork',
              data: {
                artwork_cover,
                artwork_title,
                artwork_category,
                artwork_about,
                artwork_price
              },
              success: function(url) {
                window.location.href = url;
              },
              error: function(err) {
                console.log(err);
              }
            });
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    }
  });

  $('#artwork-cover-edit').on('change', function() {
    const artworkId = window.location.href.substring(
      window.location.href.lastIndexOf('/') + 1
    );

    const fileInput = $('#artwork-cover-edit')[0];
    const file = fileInput.files[0];
    const imageType = /image.*/;

    if (file) {
      if (!file.type.match(imageType)) {
        return false;
      }

      const formData = new FormData();
      formData.append('image', file);
      if (formData) {
        $.ajax({
          type: 'POST',
          url: '/artwork-cover-edit/' + artworkId,
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          success: function(data) {
            $('#artwork-cover').attr('src', data.imageUrl);
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    }
  });

  /*   $('#artwork-edit-form').on('submit', function(e) {
    e.preventDefault();
    const artworkId = window.location.href.substring(
      window.location.href.lastIndexOf('/') + 1
    );
    const artwork_title = $('input[name=artwork_title]').val();
    const artwork_category = $('select[name=artwork_category]').val();
    const artwork_about = $('textarea[name=artwork_about]').val();
    const artwork_price = $('input[name=artwork_price]').val();
    $.ajax({
      type: 'POST',
      url: '/edit-artwork/' + artworkId,
      data: {
        artwork_title,
        artwork_category,
        artwork_about,
        artwork_price
      },
      success: function(url) {
        console.log(url);
        window.location.href = url;
      },
      error: function(err) {
        console.log(err);
      }
    });
  }); */

  $('#artwork-delete-button').on('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this artwork?')) {
      const artworkId = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
      );
      $.ajax({
        type: 'DELETE',
        url: '/edit-artwork/' + artworkId,
        success: function(url) {
          window.location.href = url;
        }
      });
    }
  });

  // Facebook ugly url appendix removal
  if (window.location.hash && window.location.hash == '#_=_') {
    window.location.hash = '';
  }
});

function deleteRequest(requestId) {
  if (confirm('Are you sure you want to delete this request?')) {
    $.ajax({
      type: 'DELETE',
      url: '/request/' + requestId,
      success: function() {
        window.location.href = '/';
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
}
$(function() {
  socket.on('increaseInbox', function() {
    $('.message-badge').html(parseInt($('.message-badge').html()) + 1);
  });
  socket.on('decreaseInbox', function() {
    console.log('decrease');
    $('.message-badge').html(parseInt($('.message-badge').html()) - 1);
  });
});
