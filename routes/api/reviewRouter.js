const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const reviewController = require('../../controllers/reviewController');

router.post('/rate-artwork/:id', isLoggedIn, reviewController.postReview);

module.exports = router;
