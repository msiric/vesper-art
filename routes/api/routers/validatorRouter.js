const router = require('express').Router();
const validatorController = require('../../../controllers/validatorController');

router.route('/validator').post(validatorController.validateLicense);

module.exports = router;
