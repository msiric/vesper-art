const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const requestController = require('../../../controllers/requestController');

router
  .route('/requests')
  .get(isAuthenticated, requestController.getRequests)
  .post(isAuthenticated, requestController.postRequest);

router
  .route('/requests/:requestId')
  .get(isAuthenticated, requestController.getRequest)
  .delete(isAuthenticated, requestController.deleteRequest);

router
  .route('/edit_request/:requestId')
  .get(isAuthenticated, requestController.editRequest)
  .patch(isAuthenticated, requestController.updateRequest);

router.route('/offers', isAuthenticated).get(requestController.getOffers);

router
  .route('/offers/:offerId', isAuthenticated)
  .get(requestController.getOffer);

module.exports = router;
