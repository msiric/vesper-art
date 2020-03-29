const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const requestController = require('../../../controllers/requestController');

router.post('/request', isAuthenticated, requestController.postRequest);

router.delete('/request/:id', isAuthenticated, requestController.deleteRequest);

router.get('/edit_request/:id', isAuthenticated, requestController.getRequest);

router.post(
  '/edit_request/:id',
  isAuthenticated,
  requestController.updateRequest
);

router.get('/requests', isAuthenticated, requestController.getUserRequests);

router.get(
  '/requests/:requestId',
  isAuthenticated,
  requestController.getUserRequest
);

router.get('/offers', isAuthenticated, requestController.getUserOffers);

router.get('/offers/:offerId', isAuthenticated, requestController.getUserOffer);

module.exports = router;
