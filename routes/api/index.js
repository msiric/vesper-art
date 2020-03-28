const express = require('express');
const router = express.Router();
const createError = require('http-errors');

/* const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema'); */

const fee = 3.15;

users = {};

const mainRoutes = require('./routers/homeRouter');
const userRoutes = require('./routers/userRouter');
const orderRoutes = require('./routers/orderRouter');
const uploadRoutes = require('./routers/uploadRouter');
const emailRoutes = require('./routers/emailRouter');
const artworkRoutes = require('./routers/artworkRouter');
const requestRoutes = require('./routers/requestRouter');
const conversationRoutes = require('./routers/conversationRouter');
const workRouter = require('./routers/workRouter');
const reviewRouter = require('./routers/reviewRouter');
const promocodeRouter = require('./routers/promocodeRouter');
const ticketRouter = require('./routers/ticketRouter');
const validatorRouter = require('./routers/validatorRouter');
const authRouter = require('./routers/authRouter');

router.use('/', mainRoutes);
router.use('/', userRoutes);
router.use('/', orderRoutes);
router.use('/', uploadRoutes);
router.use('/', emailRoutes);
router.use('/', artworkRoutes);
router.use('/', requestRoutes);
router.use('/', conversationRoutes);
router.use('/', workRouter);
router.use('/', reviewRouter);
router.use('/', promocodeRouter);
router.use('/', ticketRouter);
router.use('/', validatorRouter);
router.use('/auth', authRouter);

router.use((req, res, next) => {
  createError(404);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

module.exports = router;
