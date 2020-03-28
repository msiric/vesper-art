const router = require('express').Router();
const { isLoggedIn } = require('../../../utils/helpers');
const ticketController = require('../../../controllers/ticketController');

router.post('/contact_support', isLoggedIn, ticketController.postTicket);

module.exports = router;
