const Artwork = require('../models/artwork');
const Version = require('../models/version');
const Notification = require('../models/notification');
const Request = require('../models/request');
const createError = require('http-errors');

const fee = 3.15;

const getHomepage = async (req, res, next) => {
  try {
    const foundRequests = await Request.find({ active: true }).populate(
      'owner'
    );
    const foundArtwork = await Artwork.find({ active: true }).populate(
      'current'
    );
    return res.json({
      requests: foundRequests,
      artwork: foundArtwork
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getCreativeWriting = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'cw' }, { active: true }]
    }).populate('current');
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getMusic = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'm' }, { active: true }]
    }).populate('current');
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getVisualArts = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'va' }, { active: true }]
    }).populate('current');
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getSearchResults = async (req, res, next) => {
  try {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.json({
          content: content,
          searchResults: req.query.q
        });
      });
    }
  } catch (err) {
    next(err, res);
  }
};

const postSearchResults = async (req, res, next) => {
  try {
    if (req.body.search_input.trim()) {
      res.redirect('/search/?q=' + req.body.search_input);
    } else {
      return res.status(400).json({ message: 'Search cannot be empty' });
    }
  } catch (err) {
    next(err, res);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await Notification.find({
      receivers: { $elemMatch: { user: req.user._id } }
    })
      .populate('user')
      .sort({ created: -1 });
    res.json({ notification: foundNotifications });
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  getHomepage,
  getCreativeWriting,
  getMusic,
  getVisualArts,
  getSearchResults,
  postSearchResults,
  getNotifications
};
