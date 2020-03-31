const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const promocodeController = require('../../../controllers/promocodeController');

router
  .route('/apply_promocode')
  .post(isAuthenticated, promocodeController.postPromocode);

router
  .route('/remove_promocode')
  .delete(isAuthenticated, promocodeController.deletePromocode);

module.exports = router;
