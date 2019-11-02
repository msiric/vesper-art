const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const workController = require('../../controllers/workController');

router.get(
  '/users/:userId/custom-work/:workId',
  isLoggedIn,
  workController.getUserCustomWork
);

module.exports = router;
