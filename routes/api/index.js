import express from 'express';
import createError from 'http-errors';

const router = express.Router();

import user from './routers/user.js';
import order from './routers/order.js';
import upload from './routers/upload.js';
import artwork from './routers/artwork.js';
import review from './routers/review.js';
import discount from './routers/discount.js';
import ticket from './routers/ticket.js';
import verifier from './routers/verifier.js';
import notification from './routers/notification.js';
import checkout from './routers/checkout.js';
import comment from './routers/comment.js';
import search from './routers/search.js';
import auth from './routers/auth.js';

router.use('/', user);
router.use('/', order);
router.use('/', upload);
router.use('/', artwork);
router.use('/', review);
router.use('/', discount);
router.use('/', ticket);
router.use('/', verifier);
router.use('/', notification);
router.use('/', checkout);
router.use('/', comment);
router.use('/', search);
router.use('/auth', auth);

router.use((req, res, next) => {
  createError(404);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

export default router;
