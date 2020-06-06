import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import ticket from '../../../controllers/ticket.js';

const router = express.Router();

router.route('/contact_support').post(isAuthenticated, ticket.postTicket);

export default router;
