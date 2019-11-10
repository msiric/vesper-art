const Artwork = require('../models/artwork');
const Version = require('../models/version');
const Notification = require('../models/notification');
const Request = require('../models/request');

const fee = 3.15;

const getHomepage = async (req, res) => {
  try {
    const foundRequests = await Request.find({ active: true }).populate(
      'owner'
    );
    const foundArtwork = await Artwork.find({ active: true }).populate(
      'current'
    );
    return res.render('main/home', {
      requests: foundRequests,
      artwork: foundArtwork
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCreativeWriting = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'cw' }, { active: true }]
    }).populate('current');
    return res.render('main/creative_writing', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getMusic = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'm' }, { active: true }]
    }).populate('current');
    return res.render('main/music', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getVisualArts = async (req, res) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ category: 'va' }, { active: true }]
    }).populate('current');
    return res.render('main/visual_arts', { artwork: foundArtwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSearchResults = async (req, res, next) => {
  try {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.render('main/search-results', {
          content: content,
          searchResults: req.query.q
        });
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await Notification.find({
      receivers: { $elemMatch: { user: req.user._id } }
    })
      .populate('user')
      .sort({ created: -1 });
    res.render('accounts/notifications', { notification: foundNotifications });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
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
