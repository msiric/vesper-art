const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const licenseController = require('../../../controllers/licenseController');

router
  .route('/license/:id')
  .get(isAuthenticated, licenseController.getLicense)
  .post(isAuthenticated, licenseController.addLicense)
  .delete(isAuthenticated, licenseController.deleteLicense);

module.exports = router;
