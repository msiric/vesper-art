const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const requestController = require('../../../controllers/requestController');

router.route('/request').post(isAuthenticated, requestController.postRequest);

router
  .route('/request/:id')
  .delete(isAuthenticated, requestController.deleteRequest);

router
  .route('/edit_request/:id')
  .get(isAuthenticated, requestController.getRequest);

router
  .route('/edit_request/:id')
  .patch(isAuthenticated, requestController.updateRequest);

router
  .route('/requests')
  .get(isAuthenticated, requestController.getUserRequests);

router
  .route('/requests/:id')
  .get(isAuthenticated, requestController.getUserRequest);

router.route('/offers', isAuthenticated).get(requestController.getUserOffers);

router
  .route('/offers/:id', isAuthenticated)
  .get(requestController.getUserOffer);

module.exports = router;
