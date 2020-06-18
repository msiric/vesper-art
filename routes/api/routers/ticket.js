import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import ticket from '../../../controllers/ticket.js';

const router = express.Router();

router.route('/contact_support').post(
  isAuthenticated,
  handler(ticket.post, false, (req, res, next) => ({
    userEmail: res.locals.user ? res.locals.user.email : null,
  }))
);

export default router;
