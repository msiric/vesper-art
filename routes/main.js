const router = require('express').Router();
const async = require('async');
const Gig = require('../models/gig');
const User = require('../models/user');

router.get('/', (req, res) => {
  Gig.find({}, function(err, gigs) {
    res.render('main/home', { gigs: gigs });
  });
});

router.get('/my-gigs', (req, res, next) => {
  Gig.find({ owner: req.user._id }, function(err, gigs) {
    res.render('main/my-gigs', { gigs: gigs });
  });
});

router
  .route('/add-new-gig')
  .get((req, res, next) => {
    res.render('main/add-new-gig');
  })
  .post((req, res, next) => {
    async.waterfall([
      function(callback) {
        let gig = new Gig();
        gig.owner = req.user._id;
        gig.title = req.body.gig_title;
        gig.category = req.body.gig_category;
        gig.about = req.body.gig_about;
        gig.price = req.body.gig_price;
        gig.save(function(err) {
          callback(err, gig);
        });
      },

      function(gig, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $push: { gigs: gig._id }
          },
          function(err, count) {
            res.redirect('/my-gigs');
          }
        );
      }
    ]);
  });

router.get('/service_detail/:id', (req, res, next) => {
  Gig.findOne({ _id: req.params.id })
    .populate('owner')
    .exec(function(err, gig) {
      res.render('main/service_detail', { gig: gig });
    });
});

module.exports = router;
