const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const ticketController = require('../../../controllers/ticketController');

router.post('/contact_support', isAuthenticated, ticketController.postTicket);

module.exports = router;
