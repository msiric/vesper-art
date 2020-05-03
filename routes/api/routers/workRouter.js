const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const workController = require('../../../controllers/workController');

router
  .route('/custom_work/:workId')
  .get(isAuthenticated, workController.getUserCustomWork);

module.exports = router;
