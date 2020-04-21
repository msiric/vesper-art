const express = require('express');
const router = express.Router();
const createError = require('http-errors');

users = {};

const userRoutes = require('./routers/userRouter');
const orderRoutes = require('./routers/orderRouter');
const uploadRoutes = require('./routers/uploadRouter');
const artworkRoutes = require('./routers/artworkRouter');
const requestRoutes = require('./routers/requestRouter');
const conversationRoutes = require('./routers/conversationRouter');
const workRouter = require('./routers/workRouter');
const reviewRouter = require('./routers/reviewRouter');
const discountRouter = require('./routers/discountRouter');
const ticketRouter = require('./routers/ticketRouter');
const validatorRouter = require('./routers/validatorRouter');
const notificationRouter = require('./routers/notificationRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const commentRouter = require('./routers/commentRouter');
const authRouter = require('./routers/authRouter');

router.use('/', userRoutes);
router.use('/', orderRoutes);
router.use('/', uploadRoutes);
router.use('/', artworkRoutes);
router.use('/', requestRoutes);
router.use('/', conversationRoutes);
router.use('/', workRouter);
router.use('/', reviewRouter);
router.use('/', discountRouter);
router.use('/', ticketRouter);
router.use('/', validatorRouter);
router.use('/', notificationRouter);
router.use('/', checkoutRouter);
router.use('/', commentRouter);
router.use('/auth', authRouter);

router.use((req, res, next) => {
  createError(404);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

module.exports = router;
