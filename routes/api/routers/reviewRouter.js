const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const reviewController = require('../../../controllers/reviewController');

router.post('/rate_artwork/:id', isAuthenticated, reviewController.postReview);

module.exports = router;
