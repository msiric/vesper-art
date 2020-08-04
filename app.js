import 'dotenv/config.js';
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import createError from 'http-errors';
import { mongo } from './config/secret.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import api from './routes/api/index.js';
import stripe from './routes/stripe/index.js';

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith('/stripe')) req.rawBody = buf.toString();
    },
  })
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    secret: mongo.secret,
    keys: ['key1', 'key2'],
  })
);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
  mongo.database,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) console.log(err);
    console.log('Connected to the database');
  }
);

mongoose.set('useCreateIndex', true);

app.use('/api', api);
app.use('/stripe', stripe);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

export default app;
