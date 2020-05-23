require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const config = require('./config/secret');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const http = require('http').Server(app);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/stripe')) req.rawBody = buf.toString();
    },
  })
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: config.mongo.secret,
    signed: true,
    resave: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
  config.mongo.database,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  function (err) {
    if (err) console.log(err);
    console.log('Connected to the database');
  }
);

mongoose.set('useCreateIndex', true);

const apiRouter = require('./routes/api');
const stripeRouter = require('./routes/stripe');

app.use('/api', apiRouter);
app.use('/stripe', stripeRouter);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

module.exports = app;
