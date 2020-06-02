const router = require('express').Router();
const searchController = require('../../../controllers/searchController');

router.route('/search').get(searchController.getResults);

module.exports = router;
