const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const workController = require('../../../controllers/workController');

router.get(
  '/custom_work/:workId',
  isAuthenticated,
  workController.getUserCustomWork
);

module.exports = router;
