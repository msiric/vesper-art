const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const licenseController = require('../../../controllers/licenseController');

router
  .route('/license_information/:id')
  .get(isAuthenticated, licenseController.getLicenseInformation);

module.exports = router;
