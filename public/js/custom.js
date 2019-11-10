let socket;
$(function() {
  socket = io();
  console.log(socket);

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
        url: '/apply_promocode',
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
        url: '/remove_promocode',
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

  $('#add-license-form').on('submit', function(e) {
    e.preventDefault();
    const artwork_id = $('#artwork_id').val();

    const data =
      $('#add-license-form').serialize() + `&artworkId=${artwork_id}`;
    if (!data) {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/add_to_cart',
        data: data,
        success: function(data) {
          $('.order-card .name').append(
            '<a href="/checkout/cart" class="btn btn-success" id="in-cart">In cart</a>'
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
            $('#add-license-modal').modal('hide');
          }
        }
      });
    }
  });

  $('#remove-from-cart').on('click', function(e) {
    e.preventDefault();
    let artwork_id = $('#remove-from-cart').val();
    if (artwork_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'DELETE',
        url: '/remove_from_cart',
        data: {
          artworkId: artwork_id
        },
        success: function(data) {
          window.location.reload();
        }
      });
    }
  });

  $('#increase-artwork-quantity').click(function() {
    $('#display-licenses-modal').modal('hide');
    $('#increase-license-modal').modal('show');
    $('#save-license-button').val($(this).val());
  });

  $('.display-artwork-licenses').click(function() {
    let artworkId = $(this).val();
    $('#increase-artwork-quantity').val(artworkId);
    $.ajax({
      type: 'GET',
      url: '/license_information/' + artworkId,
      success: function(data) {
        $('#display-licenses-panel').empty();
        if (data.length == 1) {
          data.forEach(function(license) {
            $('#display-licenses-panel').append(`
            <div id="${license.artwork}" class="form-group">
              <label>License credentials</label>
              <p class="license-owner">${license.credentials}</p>
              <label>License type</label>
              <p class="license-type">${license.type}</p>
              <label>License price</label>
              <p class="license-price">${license.price}</p>
            </div>`);
          });
        } else {
          data.forEach(function(license) {
            $('#display-licenses-panel').append(`
            <div id="${license.artwork}" class="license-information form-group">
              <label>License credentials</label>
              <p class="license-owner">${license.credentials}</p>
              <label>License type</label>
              <p class="license-type">${license.type}</p>
              <label>License price</label>
              <p class="license-price">${license.price}</p>
              <button value="${license._id}" class="btn btn-sm btn-danger delete-license-button">Delete
                license</button>
            </div>`);
          });
        }
        $('#display-licenses-modal').modal('show');
      }
    });
  });

  $('#increase-license-form').on('submit', function(e) {
    e.preventDefault();
    let artwork_id = $('#save-license-button').val();

    const data =
      $('#increase-license-form').serialize() + `&artworkId=${artwork_id}`;
    if (artwork_id === '') {
      return false;
    } else {
      $.ajax({
        type: 'POST',
        url: '/increase_artwork_quantity',
        data: data,
        success: function() {
          window.location.reload();
        }
      });
    }
  });

  $('#display-licenses-panel').on(
    'click',
    '.delete-license-button',
    function() {
      let licenseId = $(this).val();
      let artworkId = $('.delete-license-button')
        .closest('.license-information')
        .attr('id');
      if (licenseId === '' || artworkId === '') {
        return false;
      } else {
        $.ajax({
          type: 'POST',
          url: '/decrease_artwork_quantity',
          data: {
            licenseId: licenseId,
            artworkId: artworkId
          },
          success: function() {
            window.location.reload();
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    }
  );

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
          url: '/profile_image_upload',
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
    const mediaInput = $('#artwork-media-upload')[0];
    const mediaFile = mediaInput.files[0];
    const mediaType = /image.*/;
    let artworkCover;
    let artworkMedia;

    if (mediaFile) {
      if (!mediaFile.type.match(mediaType)) {
        return false;
      }
      const formData = new FormData();
      formData.append('artwork_media', mediaFile);
      if (formData) {
        $.ajax({
          type: 'POST',
          url: '/artwork_media_upload',
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          success: function(data) {
            artworkCover = data.coverUrl;
            artworkMedia = data.originalUrl;
            const artwork_cover = artworkCover;
            const artwork_media = artworkMedia;
            const artwork_title = $('input[name=artwork_title]').val();
            const artwork_type = $('select[name=artwork_type]').val();
            const artwork_category = $('select[name=artwork_category]').val();
            const artwork_price = $('input[name=artwork_price]').val();
            const artwork_license = $('select[name=artwork_license]').val();
            const artwork_available = $('select[name=artwork_available]').val();
            const artwork_commercial = $(
              'input[name=artwork_commercial]'
            ).val();
            const artwork_about = $('textarea[name=artwork_about]').val();
            $.ajax({
              type: 'POST',
              url: '/add_new_artwork',
              data: {
                artwork_cover,
                artwork_media,
                artwork_title,
                artwork_type,
                artwork_category,
                artwork_price,
                artwork_license,
                artwork_available,
                artwork_commercial,
                artwork_about
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

  $('#artwork-edit-form').on('submit', function(e) {
    e.preventDefault();
    const urlId = window.location.href.substring(
      window.location.href.lastIndexOf('/') + 1
    );
    const mediaInput = $('#artwork-media-edit')[0];
    const mediaFile = mediaInput.files[0];
    const mediaType = /image.*/;
    let artworkCover;
    let artworkMedia;
    if (mediaFile) {
      if (!mediaFile.type.match(mediaType)) {
        return false;
      }
      const formData = new FormData();
      formData.append('artwork_media', mediaFile);
      if (formData) {
        $.ajax({
          type: 'PUT',
          url: '/artwork_media_edit/' + urlId,
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          success: function(data) {
            artworkCover = data.coverUrl;
            artworkMedia = data.originalUrl;
            saveArtwork();
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    } else {
      saveArtwork();
    }

    function saveArtwork() {
      const artwork_cover = artworkCover;
      const artwork_media = artworkMedia;
      const artwork_title = $('input[name=artwork_title]').val();
      const artwork_type = $('select[name=artwork_type]').val();
      const artwork_category = $('select[name=artwork_category]').val();
      const artwork_price = $('input[name=artwork_price]').val();
      const artwork_license = $('select[name=artwork_license]').val();
      const artwork_available = $('select[name=artwork_available]').val();
      const artwork_commercial = $('input[name=artwork_commercial]').val();
      const artwork_about = $('textarea[name=artwork_about]').val();
      $.ajax({
        type: 'PUT',
        url: '/edit_artwork/' + urlId,
        data: {
          artwork_cover,
          artwork_media,
          artwork_title,
          artwork_type,
          artwork_category,
          artwork_price,
          artwork_license,
          artwork_available,
          artwork_commercial,
          artwork_about
        },
        success: function(url) {
          window.location.href = url;
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
  });

  $('#artwork-delete-button').on('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this artwork?')) {
      const artworkId = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
      );
      $.ajax({
        type: 'DELETE',
        url: '/edit_artwork/' + artworkId,
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

$('#user-delete-button').on('click', function(e) {
  e.preventDefault();
  if (confirm('Are you sure you want to delete your account?')) {
    $.ajax({
      type: 'POST',
      url: '/delete_user',
      success: function(data) {
        window.location.href = data;
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
});

// add artwork id value to hidden input before publishing the review
$('.rate-artwork').click(function() {
  $('#modal-id-input').val(this.id);
});

// validate all inputs and :id
$('#rate-artwork-form').on('submit', function(e) {
  e.preventDefault();
  const artworkId = $('#modal-id-input').val();
  const orderId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  const data = $('#rate-artwork-form').serialize() + '&orderId=' + orderId;

  if (artworkId) {
    $.ajax({
      type: 'POST',
      data: data,
      url: `/rate_artwork/${artworkId}`,
      success: function(data) {
        console.log(data);
      },
      error: function(err) {
        console.log(err);
      }
    });
  } else {
    console.log('Something went wrong');
  }
});

$('#contact-support-form').on('submit', function(e) {
  e.preventDefault();
  const data = $('#contact-support-form').serialize();

  $.ajax({
    type: 'POST',
    data: data,
    url: `/contact_support/`,
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
});

$('.save-artwork-button').on('click', function() {
  const artworkId = this.id;
  if (artworkId) {
    $.ajax({
      type: 'POST',
      url: `/save_artwork/${artworkId}`,
      success: function(data) {
        if (data.saved) {
          $('.save-artwork-button').html('Remove artwork');
        } else {
          $('.save-artwork-button').html('Save artwork');
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  } else {
    console.log('Something went wrong');
  }
});

$('#validate-license-form').on('submit', function(e) {
  e.preventDefault();
  const data = $('#validate-license-form').serialize();

  $.ajax({
    type: 'POST',
    data: data,
    url: `/validator`,
    success: function(data) {
      console.log(data.foundLicense);
    },
    error: function(err) {
      console.log(err);
    }
  });
});

$('#retrieve-license-button').on('click', function() {
  $.ajax({
    type: 'POST',
    data: data,
    url: `/validator`,
    success: function(data) {
      let newTab = window.open();
      newTab.document.write(
        `<iframe src="data:application/pdf;base64,${data.pdf}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    },
    error: function(err) {
      console.log(err);
    }
  });
});

$(function() {
  socket.on('increaseInbox', function(data) {
    if (window.location.pathname != '/conversations/' + data.url) {
      console.log('increaseInbox');
      $('.message-badge').html(parseInt($('.message-badge').html()) + 1);
    }
  });
  socket.on('increaseNotif', function() {
    console.log('increaseNotif');
    $('.notification-badge').html(
      parseInt($('.notification-badge').html()) + 1
    );
  });
});
