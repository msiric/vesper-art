const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const promocodeController = require('../../../controllers/promocodeController');

router.post(
  '/apply_promocode',
  isAuthenticated,
  promocodeController.postPromocode
);

router.post(
  '/remove_promocode',
  isAuthenticated,
  promocodeController.deletePromocode
);

module.exports = router;
