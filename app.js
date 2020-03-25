require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const config = require('./config/secret');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  'use strict';
  req.io = io;
  next();
});

mongoose.connect(
  config.mongo.database,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err) {
    if (err) console.log(err);
    console.log('Connected to the database');
  }
);

mongoose.set('useCreateIndex', true);

const indexRouter = require('./routes/index');
const api = require('./routes/api');

const mainRoutes = require('./routes/api/homeRouter');
const userRoutes = require('./routes/api/userRouter');
const orderRoutes = require('./routes/api/orderRouter');
const uploadRoutes = require('./routes/api/uploadRouter');
const emailRoutes = require('./routes/api/emailRouter');
const artworkRoutes = require('./routes/api/artworkRouter');
const requestRoutes = require('./routes/api/requestRouter');
const conversationRoutes = require('./routes/api/conversationRouter');
const workRouter = require('./routes/api/workRouter');
const reviewRouter = require('./routes/api/reviewRouter');
const promocodeRouter = require('./routes/api/promocodeRouter');
const ticketRouter = require('./routes/api/ticketRouter');
const validatorRouter = require('./routes/api/validatorRouter');
const authRouter = require('./routes/api/authRouter');

app.use(mainRoutes);
app.use(userRoutes);
app.use(orderRoutes);
app.use(uploadRoutes);
app.use(emailRoutes);
app.use(artworkRoutes);
app.use(requestRoutes);
app.use(conversationRoutes);
app.use(workRouter);
app.use(reviewRouter);
app.use(promocodeRouter);
app.use(ticketRouter);
app.use(validatorRouter);
app.use(authRouter);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
