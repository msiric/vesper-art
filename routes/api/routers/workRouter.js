const router = require('express').Router();
const { isLoggedIn } = require('../../../utils/helpers');
const workController = require('../../../controllers/workController');

router.get(
  '/custom_work/:workId',
  isLoggedIn,
  workController.getUserCustomWork
);

module.exports = router;
