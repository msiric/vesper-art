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

const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

module.exports = app;
