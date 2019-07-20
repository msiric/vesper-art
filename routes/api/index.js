const express = require('express');
const router = express.Router();

const artworkRouter = require('./artworkRouter');
const chatRouter = require('./chatRouter');
const emailRouter = require('./emailRouter');
const homeRouter = require('./homeRouter');
const orderRouter = require('./orderRouter');
const requestRouter = require('./requestRouter');
const uploadRouter = require('./uploadRouter');
const userRouter = require('./userRouter');
const workRouter = require('./workRouter');

router.use('/', artworkRouter);
router.use('/', chatRouter);
router.use('/', emailRouter);
router.use('/', homeRouter);
router.use('/', orderRouter);
router.use('/', requestRouter);
router.use('/', uploadRouter);
router.use('/', userRouter);
router.use('/', workRouter);

// error handler
router.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = router;
