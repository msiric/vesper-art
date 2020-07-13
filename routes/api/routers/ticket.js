import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import { postTicket } from '../../../controllers/ticket.js';

const router = express.Router();

router.route('/contact_support').post(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(postTicket, false, (req, res, next) => ({
    userEmail: res.locals.user ? res.locals.user.email : null,
  }))
);

export default router;
