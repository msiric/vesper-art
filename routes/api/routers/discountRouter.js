const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const discountController = require('../../../controllers/discountController');

router
  .route('/discount')
  .post(isAuthenticated, discountController.postDiscount);

router
  .route('/discount/:discountId')
  .delete(isAuthenticated, discountController.deleteDiscount);

module.exports = router;
