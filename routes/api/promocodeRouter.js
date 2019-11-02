const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const promocodeController = require('../../controllers/promocodeController');

router.post('/apply_promocode', isLoggedIn, promocodeController.postPromocode);

router.post(
  '/remove_promocode',
  isLoggedIn,
  promocodeController.deletePromocode
);

module.exports = router;
