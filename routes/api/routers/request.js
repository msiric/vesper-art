import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import request from '../../../controllers/request.js';

const router = express.Router();

router
  .route('/requests')
  .get(isAuthenticated, request.getRequests)
  .post(isAuthenticated, request.postRequest);

router
  .route('/requests/:requestId')
  .get(isAuthenticated, request.getRequest)
  .delete(isAuthenticated, request.deleteRequest);

router
  .route('/edit_request/:requestId')
  .get(isAuthenticated, request.editRequest)
  .patch(isAuthenticated, request.updateRequest);

router.route('/offers', isAuthenticated).get(request.getOffers);

router.route('/offers/:offerId', isAuthenticated).get(request.getOffer);

export default router;
