const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const ticketController = require('../../../controllers/ticketController');

router
  .route('/contact_support')
  .post(isAuthenticated, ticketController.postTicket);

module.exports = router;
