const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('express-flash');
const hbs = require('hbs');
const moment = require('moment');
const expressHbs = require('express-handlebars');
const passportSocketIo = require('passport.socketio');
const cors = require('cors');
const createError = require('http-errors');
require('dotenv').config();

const config = require('./config/secret');
const sessionStore = new MongoStore({
  url: config.database,
  autoReconnect: true
});

hbsEngine = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout.hbs'
});

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors());
app.options('*', cors());

app.use(function(req, res, next) {
  'use strict';
  req.io = io;
  next();
});

const sessionMiddleware = session({
  // needs change?
  resave: false,
  saveUninitialized: true,
  secret: config.secret,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 30 * 24 * 60 * 60 * 1000,
  store: sessionStore
});

mongoose.connect(config.database, { useNewUrlParser: true }, function(err) {
  if (err) console.log(err);
  console.log('Connected to the database');
});
mongoose.set('useCreateIndex', true);

app.engine(
  '.hbs',
  expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: {
      formatDate: function(date, format) {
        return moment(date).format(format);
      },
      formatStatusOrder: function(status) {
        if (status == 0) {
          return 'Cancelled';
        } else if (status == 1) {
          return 'Dispute';
        } else if (status == 2) {
          return 'Completed';
        } else {
          return 'Error';
        }
      },
      formatButtonOrder: function(status) {
        if (status == 0) {
          return 'danger';
        } else if (status == 1) {
          return 'warning';
        } else if (status == 2) {
          return 'success';
        } else {
          return 'light';
        }
      },
      formatStatusWork: function(status) {
        if (status == 0) {
          return 'Cancelled';
        } else if (status == 1) {
          return 'Dispute';
        } else if (status == 2) {
          return 'In progress';
        } else if (status == 3) {
          return 'Completed';
        } else {
          return 'Error';
        }
      },
      formatButtonWork: function(status) {
        if (status == 0) {
          return 'danger';
        } else if (status == 1) {
          return 'warning';
        } else if (status == 2) {
          return 'primary';
        } else if (status == 3) {
          return 'success';
        } else {
          return 'light';
        }
      },
      formatCheckbox: function(a) {
        if (a) {
          return 'checked';
        }
      },
      formatUsername: function(a, b, c, d) {
        if (a.equals(b)) {
          return c;
        } else {
          return d;
        }
      },
      formatChatName: function(a, b, c, d) {
        if (a.equals(b)) {
          return c;
        } else {
          return d;
        }
      },
      formatChatPhoto: function(a, b, c, d) {
        if (a.equals(b)) {
          return c;
        } else {
          return d;
        }
      },
      formatCheckbox: function(a) {
        if (a) {
          return 'checked';
        }
      },
      formatSelection: function(a, b) {
        if (a === b) {
          return 'selected';
        }
      },
      checkIfEqualsId: function(a, b, opts) {
        if (a.equals(b)) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
      checkIfEqualsString: function(a, b, opts) {
        if (a === b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      }
    }
  })
);

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser, // the same middleware you registrer in express
    key: 'connect.sid', // the name of the cookie where express/connect stores its session_id
    secret: config.secret, // the session_secret to parse the cookie
    store: sessionStore, // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess, // *optional* callback on success - read more below
    fail: onAuthorizeFail // *optional* callback on fail/error - read more below
  })
);

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log('failed connection to socket.io:', message);
  if (error) accept(new Error(message));
}

/* require('./routes/index')(io);
 */ require('./realtime/io')(io);

const indexRouter = require('./routes/index');
const api = require('./routes/api');

// app.use('/', indexRouter);
// app.use('/api', api);

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

app.set('socketio', io);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err.message);
});

http.listen(config.port, err => {
  if (err) console.log(err);
  console.log(`Running on port ${config.port}`);
});

/* app.use(function(req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});
 */
