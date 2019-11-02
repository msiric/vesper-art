const router = require('express').Router();
const validatorController = require('../../controllers/validatorController');

router
  .route('/validator')
  .get(validatorController.getValidator)
  .post(validatorController.validateLicense);

module.exports = router;
