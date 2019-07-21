const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const requestController = require('../../controllers/requestController');

router.post('/request', isLoggedIn, requestController.postRequest);

router.delete('/request/:id', isLoggedIn, requestController.deleteRequest);

router.get('/edit-request/:id', isLoggedIn, requestController.getRequest);

router.post('/edit-request/:id', isLoggedIn, requestController.updateRequest);

router.get(
  '/users/:id/requests',
  isLoggedIn,
  requestController.getUserRequests
);

router.get(
  '/users/:userId/requests/:requestId',
  isLoggedIn,
  requestController.getUserRequest
);

router.get('/users/:id/offers', isLoggedIn, requestController.getUserOffers);

router.get(
  '/users/:userId/offers/:offerId',
  isLoggedIn,
  requestController.getUserOffer
);

module.exports = router;
