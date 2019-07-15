const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const requestController = require('../../controllers/requestController');

router.post('/request', isLoggedInAPI, requestController.postRequest);

router.delete('/request/:id', isLoggedInAPI, requestController.deleteRequest);

router.get('/edit-request/:id', isLoggedInAPI, requestController.getRequest);

router.post(
  '/edit-request/:id',
  isLoggedInAPI,
  requestController.updateRequest
);

router.get(
  '/users/:id/requests',
  isLoggedInAPI,
  requestController.getUserRequests
);

router.get('/users/:userId/requests/:requestId', isLoggedInAPI, getUserRequest);

router.get('/users/:id/offers', isLoggedInAPI, getUserOffers);

router.get('/users/:userId/offers/:offerId', isLoggedInAPI, getUserOffer);

module.exports = router;
