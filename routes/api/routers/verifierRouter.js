const router = require('express').Router();
const verifierController = require('../../../controllers/verifierController');

router.route('/verifier').post(verifierController.verifyLicense);

module.exports = router;
