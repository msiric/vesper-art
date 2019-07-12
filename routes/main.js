const router = require('express').Router();
const async = require('async');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Promocode = require('../models/promocode');
const Notification = require('../models/notification');
const Request = require('../models/request');

const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema');

const fee = 3.15;

router.get('/', (req, res) => {
  let id = null;
  if (req.user) {
    id = req.user._id;
  }
  async.series(
    [
      function(callback) {
        Request.find({})
          .populate('poster')
          .exec(function(err, requests) {
            if (err) console.log(err);
            callback(err, requests);
          });
      },
      function(callback) {
        Artwork.find({}, function(err, artwork) {
          callback(err, artwork);
        });
      }
    ],
    function(err, results) {
      res.render('main/home', {
        id: id,
        requests: results[0],
        artwork: results[1]
      });
    }
  );
});

router.get('/categories/creative-writing', (req, res) => {
  Artwork.find({ category: 'cw' }, function(err, artwork) {
    res.render('main/creative-writing', { artwork: artwork });
  });
});

router.get('/categories/music', (req, res) => {
  Artwork.find({ category: 'm' }, function(err, artwork) {
    res.render('main/music', { artwork: artwork });
  });
});

router.get('/categories/visual-arts', (req, res) => {
  Artwork.find({ category: 'va' }, function(err, artwork) {
    res.render('main/visual-arts', { artwork: artwork });
  });
});

router
  .route('/search')
  .get((req, res, next) => {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.render('main/search-results', {
          content: content,
          searchResults: req.query.q
        });
      });
    }
  })
  .post((req, res, next) => {
    if (req.body.search_input.trim()) {
      res.redirect('/search/?q=' + req.body.search_input);
    } else {
      req.flash('error', 'Search cannot be empty');
      res.redirect('/');
    }
  });

router.get('/api/add-promocode', (req, res, next) => {
  let promocode = new Promocode();
  promocode.name = 'testcoupon';
  promocode.discount = 0.4;
  promocode.save(function(err) {
    res.json('Successful');
  });
});

router.post('/promocode', (req, res, next) => {
  let promocode = req.body.promocode;
  let totalPrice = req.session.price;
  let subtotal = totalPrice - fee;
  if (!req.session.discount) {
    Promocode.findOne({ name: promocode }, function(err, foundCode) {
      if (foundCode) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          if (req.session.discount) {
            res.json({ warningUsed: 'You already used a promo code' });
          } else {
            let discount = foundCode.discount * 100;
            let promo = foundCode._id;
            subtotal = (totalPrice - fee) * (1 - foundCode.discount);
            totalPrice = subtotal + fee;
            req.session.price = totalPrice;
            req.session.discount = foundCode._id;
            res.json({ totalPrice, subtotal, discount, promo });
          }
        });
      } else {
        res.json({ warningUnfound: 'Promo code does not exist' });
      }
    });
  } else {
    res.json({ warningMulti: 'You already have an active promo code' });
  }
});

router.post('/remove-promocode', (req, res, next) => {
  let promocode = req.body.promocode;
  let totalPrice = req.session.price;
  let subtotal = totalPrice - fee;
  async.waterfall([
    function(callback) {
      Promocode.findOne({ _id: promocode }, function(err, promo) {
        callback(err, promo);
      });
    },
    function(promo, callback) {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { promos: promo._id }
        },
        function(err, user) {
          let discount = promo.discount;
          subtotal = totalPrice - fee;
          subtotal = subtotal / (1 - discount);
          totalPrice = subtotal + fee;
          req.session.price = totalPrice;
          req.session.discount = null;
          res.json({ totalPrice, subtotal });
        }
      );
    }
  ]);
});

router.post('/send-message', (req, res, next) => {
  let userId = req.body.user;
  let messageVal = req.body.message;
  async.waterfall([
    function(callback) {
      if (messageVal) {
        if (req.body.user != req.user._id) {
          let message = new Message();
          message.owner = req.user._id;
          message.content = messageVal;
          message.save(function(err) {
            callback(err, message);
          });
        } else {
          res.json({ error: 'You cannot send a message to yourself' });
        }
      } else {
        res.json({ error: 'Message cannot be empty' });
      }
    },
    function(message, callback) {
      Conversation.findOne(
        {
          $and: [
            {
              $or: [{ first: userId }, { first: req.user._id }]
            },
            {
              $or: [{ second: userId }, { second: req.user._id }]
            }
          ]
        },
        function(err, conversation) {
          if (conversation) {
            Conversation.update(
              { _id: conversation._id },
              {
                $push: { messages: message._id }
              },
              function(err, count) {
                if (err) return err;
                res.json({ success: conversation._id });
              }
            );
          } else {
            callback(err, message);
          }
        }
      );
    },
    function(message, callback) {
      let conversation = new Conversation();
      conversation.first = req.user._id;
      conversation.second = userId;
      conversation.messages.push(message._id);
      conversation.save(function(err) {
        if (err) return err;
        res.json({ success: conversation._id });
      });
    }
  ]);
});

router.get('/conversations', (req, res) => {
  if (req.user) {
    Conversation.find({
      $or: [{ first: req.user._id }, { second: req.user._id }]
    })
      .populate('first')
      .populate('second')
      .deepPopulate('messages.owner')
      .exec(function(err, conversations) {
        console.log(conversations);
        res.render('accounts/convo-room', {
          layout: 'convo-chat',
          conversations: conversations
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/conversations/:convoId', (req, res, next) => {
  if (req.user) {
    req.session.convoId = req.params.convoId;
    async.series(
      [
        function(callback) {
          Conversation.find({
            $or: [{ first: req.user._id }, { second: req.user._id }]
          })
            .populate('first')
            .populate('second')
            .deepPopulate('messages.owner')
            .exec(function(err, conversations) {
              if (err) console.log(err);
              callback(err, conversations);
            });
        },
        function(callback) {
          Conversation.findOne({ _id: req.params.convoId })
            .populate('first')
            .populate('second')
            .deepPopulate('messages.owner')
            .exec(function(err, conversation) {
              callback(err, conversation);
            });
        }
      ],
      function(err, results) {
        if (err) return err;
        res.render('accounts/convo-room', {
          layout: 'convo-chat',
          conversations: results[0],
          conversation: results[1],
          helpers: {
            if_equals: function(a, b, opts) {
              if (a.equals(b)) {
                return opts.fn(this);
              } else {
                return opts.inverse(this);
              }
            }
          }
        });
      }
    );
  } else {
    res.redirect('/login');
  }
});

router.get('/notifications', (req, res, next) => {
  if (req.user) {
    Notification.find({ receiver: req.user._id })
      .populate('sender')
      .exec(function(err, notifications) {
        res.render('accounts/notifications', { notifications: notifications });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/', (req, res) => {
  async.series(
    [
      function(callback) {
        Request.find({}, function(err, requests) {
          if (err) console.log(err);
          callback(err, requests);
        });
      },
      function(callback) {
        Artwork.find({}, function(err, artwork) {
          callback(err, artwork);
        });
      }
    ],
    function(err, results) {
      res.render('main/home', { requests: results[0], artwork: results[1] });
    }
  );
});

module.exports = router;
