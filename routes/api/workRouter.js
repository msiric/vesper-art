const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const workController = require('../../controllers/workController');

router.get(
  '/users/:userId/custom-work/:workId',
  isLoggedInAPI,
  workController.getUserCustomWork
);

module.exports = router;
