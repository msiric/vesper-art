const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const reviewController = require('../../controllers/reviewController');

router.post('/rate_artwork/:id', isLoggedIn, reviewController.postReview);

module.exports = router;
