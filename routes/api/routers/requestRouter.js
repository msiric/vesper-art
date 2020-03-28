const router = require('express').Router();
const { isLoggedIn } = require('../../../utils/helpers');
const requestController = require('../../../controllers/requestController');

router.post('/request', isLoggedIn, requestController.postRequest);

router.delete('/request/:id', isLoggedIn, requestController.deleteRequest);

router.get('/edit_request/:id', isLoggedIn, requestController.getRequest);

router.post('/edit_request/:id', isLoggedIn, requestController.updateRequest);

router.get('/requests', isLoggedIn, requestController.getUserRequests);

router.get(
  '/requests/:requestId',
  isLoggedIn,
  requestController.getUserRequest
);

router.get('/offers', isLoggedIn, requestController.getUserOffers);

router.get('/offers/:offerId', isLoggedIn, requestController.getUserOffer);

module.exports = router;
