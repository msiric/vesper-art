const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.render('main/home');
});

router.get('/my-gigs', (req, res) => {
  res.render('main/my-gigs');
});

router.get('/add-new-gig', (req, res) => {
  res.render('main/add-new-gig');
});

module.exports = router;
