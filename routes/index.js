const express = require('express');
const router = express.Router();

const async = require('async');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Promocode = require('../models/promocode');
const Notification = require('../models/notification');
const Request = require('../models/request');

/* const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema'); */

const fee = 3.15;

const { isLoggedIn } = require('../utils/helpers');

router.get('/', isLoggedIn, (req, res) => {
  res.render('campaigns-overview', {
    active: 'campaigns',
    submenu: 'overview'
  });
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('login');
});

/* Campaigns page - overview */
router.get('/campaigns', [isLoggedIn, noCache], (req, res) => {
  res.render('campaigns-overview', {
    active: 'campaigns',
    submenu: 'c-overview'
  });
});

/* Campaigns page - create */
router.get('/campaigns-create', [isLoggedIn, noCache], (req, res) => {
  res.render('campaigns-create', {
    active: 'campaigns',
    submenu: 'c-create'
  });
});

/* Campaigns page - single */
router.get('/campaigns/:campaign_id', [isLoggedIn, noCache], (req, res) => {
  res.render('campaigns-single', {
    active: 'campaigns',
    submenu: 'single'
  });
});

/* Videos page */
router.get('/videos', [isLoggedIn, noCache], (req, res) => {
  res.render('videos', {
    active: 'videos',
    submenu: ''
  });
});

/* Videoplayer page - PUBLIC */
router.get('/campaigns/:campaign_id/watch', noCache, (req, res, next) => {
  const { user_id } = req.query;

  if (user_id && user_id.match(/^\d{4,12}$/)) {
    res.render('videoplayer', {
      active: 'videoplayer',
      submenu: '',
      user_identifier: user_id
    });
  } else {
    next();
  }
});

// NEW
/* Onboarding page - overview */
router.get('/onboardings', [isLoggedIn, noCache], (req, res) => {
  res.render('onboardings-overview', {
    active: 'onboardings',
    submenu: 'o-overview'
  });
});

/* Onboarding page - create */
router.get('/onboardings-create', [isLoggedIn, noCache], (req, res) => {
  res.render('onboardings-create', {
    active: 'onboardings',
    submenu: 'o-create'
  });
});

/* Onboarding page - single */
router.get('/onboardings/:onboarding_id', [isLoggedIn, noCache], (req, res) => {
  res.render('onboardings-single', {
    active: 'onboardings',
    submenu: 'o-single'
  });
});

/* Onboarding page - PUBLIC */
router.get('/onboarding/:guid', noCache, (req, res, next) => {
  const { user_id } = req.query;

  if (user_id && user_id.match(/^\d{4,12}$/)) {
    onboardingRerouting(req, res, next);
  } else {
    next();
  }
});

/* Onboarding finished - PUBLIC */
router.get('/onboarding-finished', noCache, (req, res, next) => {
  const { confirmation } = req.query;
  res.render('onboarding-finished', {
    active: 'videoplayer',
    submenu: '',
    confirmation
  });
});

module.exports = router;
