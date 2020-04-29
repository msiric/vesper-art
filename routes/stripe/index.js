const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const stripeRouter = require('./routers/stripeRouter');

router.use('/', stripeRouter);

router.use((req, res, next) => {
  createError(404);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

module.exports = router;
