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

const config = require('./config/secret');
const sessionStore = new MongoStore({
  url: config.database,
  autoReconnect: true
});

hbsEngine = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout.hbs',
  helpers: {
    formatDate: function(date, format) {
      return moment(date).format(format);
    },
    formatStatus: function(status) {
      if (status == 0) {
        return 'Cancelled';
      } else if (status == 1) {
        return 'In progress';
      } else if (status == 2) {
        return 'Completed';
      } else {
        return 'Error';
      }
    }
  }
});

hbs.registerHelper('formatCheckbox', function(a) {
  if (a) {
    return 'checked';
  }
});

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: new MongoStore({ url: config.database, autoReconnect: true })
});

mongoose.connect(config.database, { useNewUrlParser: true }, function(err) {
  if (err) console.log(err);
  console.log('Connected to the database');
});

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
      formatChatName: function(a, b, c, d) {
        if (a == b) {
          return c;
        } else {
          return d;
        }
      },
      formatChatPhoto: function(a, b, c, d) {
        if (a == b) {
          return c;
        } else {
          return d;
        }
      }
    }
  })
);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

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

require('./realtime/io')(io);

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const uploadRoutes = require('./routes/upload');
const emailRoutes = require('./routes/email');
const artworkRoutes = require('./routes/artwork');
const requestRoutes = require('./routes/request');

app.use(mainRoutes);
app.use(userRoutes);
app.use(orderRoutes);
app.use(uploadRoutes);
app.use(emailRoutes);
app.use(artworkRoutes);
app.use(requestRoutes);

http.listen(config.port, err => {
  if (err) console.log(err);
  console.log(`Running on port ${config.port}`);
});

app.use(function(req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});
