const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const ticketController = require('../../controllers/ticketController');

router.get('/contact-support', isLoggedIn, ticketController.getSupport);

router.post('/contact-support', isLoggedIn, ticketController.postTicket);

module.exports = router;
