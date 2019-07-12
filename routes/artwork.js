const aws = require('aws-sdk');
const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const Artwork = require('../models/artwork');

router.get('/my-artwork', (req, res, next) => {
  Artwork.find({ owner: req.user._id }, function(err, artwork) {
    res.render('main/my-artwork', { artwork: artwork });
  });
});

router
  .route('/add-new-artwork')
  .get((req, res, next) => {
    res.render('main/add-new-artwork');
  })
  .post((req, res, next) => {
    async.waterfall([
      function(callback) {
        let artwork = new Artwork();
        artwork.owner = req.user._id;
        artwork.cover = req.body.artwork_cover;
        artwork.title = req.body.artwork_title;
        artwork.category = req.body.artwork_category;
        artwork.about = req.body.artwork_about;
        artwork.price = req.body.artwork_price;
        artwork.save(function(err) {
          callback(err, artwork);
        });
      },

      function(artwork, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $push: { artworks: artwork._id }
          },
          function(err, count) {
            if (err) console.log(err);
            res.json('/my-artwork');
          }
        );
      }
    ]);
  });

router.get('/artwork-details/:id', (req, res, next) => {
  let artwork_id = req.params.id;
  Artwork.findOne({ _id: req.params.id })
    .populate('owner')
    .exec(function(err, artwork) {
      if (artwork) {
        let inCart = false;
        let id = null;
        if (req.user) {
          id = req.user._id;
          if (req.user.cart.indexOf(artwork_id) > -1) {
            inCart = true;
          }
        }
        res.render('main/artwork-details', {
          id: id,
          artwork: artwork,
          inCart: inCart
        });
      } else {
        req.flash('error', 'Artwork not found');
        res.redirect('/');
      }
    });
});

router
  .route('/edit-artwork/:id')
  .get((req, res, next) => {
    Artwork.findOne({ _id: req.params.id }, function(err, artwork) {
      if (artwork) {
        res.render('main/edit-artwork', {
          artwork: artwork
        });
      } else {
        req.flash('error', 'Artwork not found');
        res.redirect('/');
      }
    });
  })
  .post((req, res, next) => {
    Artwork.findOne({ _id: req.params.id }, function(err, artwork) {
      if (artwork) {
        if (req.body.artwork_cover) artwork.cover = req.body.artwork_cover;
        if (req.body.artwork_title) artwork.title = req.body.artwork_title;
        if (req.body.artwork_category)
          artwork.category = req.body.artwork_category;
        if (req.body.artwork_about) artwork.about = req.body.artwork_about;
        if (req.body.artwork_price) artwork.price = req.body.artwork_price;
        artwork.save(function(err) {
          if (err) console.log(err);
          req.flash('success', 'Artwork successfully edited');
          res.json('/my-artwork');
        });
      } else {
        req.flash('error', 'Artwork not found');
        res.redirect('/');
      }
    });
  })
  .delete((req, res, next) => {
    async.waterfall([
      function(callback) {
        Artwork.findOne({ _id: req.params.id }, function(err, artwork) {
          if (artwork && artwork.cover) {
            Artwork.deleteOne({ _id: req.params.id }, function(err, results) {
              const fileName = artwork.cover.split('/').slice(-1)[0];
              const folderName = 'artworkCovers/';
              const filePath = folderName + fileName;
              const s3 = new aws.S3();
              const params = {
                Bucket: 'vesper-testing',
                Key: filePath
              };
              s3.deleteObject(params, function(err, data) {
                if (err) {
                  console.log(err);
                }
                callback(err, results);
              });
            });
          } else {
            req.flash('error', 'Artwork not found');
            res.redirect('/');
          }
        });
      },
      function(results, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $pull: { artworks: req.params.id }
          },
          function(err, count) {
            if (err) console.log(err);
            req.flash('success', 'Artwork successfully deleted');
            res.json('/my-artwork');
          }
        );
      }
    ]);
  });
module.exports = router;
