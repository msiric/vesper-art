const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const randomString = require('randomstring');
const axios = require('axios');

const getSignUp = async (req, res, next) => {
  try {
    res.render('accounts/signup');
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postSignUp = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $or: [{ email: req.body.email }, { name: req.body.username }]
    });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: 'Account with that email/username already exists' });
    } else {
      let verificationInfo = {
        token: randomString.generate(),
        email: req.body.email
      };
      let user = new User();
      user.name = req.body.username;
      user.email = req.body.email;
      user.photo = foundUser.gravatar();
      user.password = req.body.password;
      user.customWork = true;
      user.secretToken = verificationInfo.token;
      user.verified = false;
      const savedUser = await user.save();
      if (savedUser) {
        axios
          .post('http://localhost:3000/send-email', verificationInfo, {
            proxy: false
          })
          .then(res => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log(res);
          })
          .catch(error => {
            console.error(error);
          });
        return res
          .status(200)
          .json({ message: 'Account created successfully' });
      } else {
        return res.status(400).json({ message: 'Could not create account' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getLogIn = async (req, res, next) => {
  try {
    res.render('accounts/login');
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postLogIn = async () => {
  try {
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getFacebookLogIn = async () => {
  try {
    passport.authenticate('facebook', { scope: 'email' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getFacebookCallback = async () => {
  try {
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getGoogleLogIn = async () => {
  try {
    passport.authenticate('google', { scope: 'email' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getGoogleCallback = async () => {
  try {
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserProfile = async () => {
  try {
    passportConfig.isAuthenticated,
      (req, res, next) => {
        res.render('accounts/profile', { message: req.flash('success') });
      };
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      if (req.body.name) foundUser.name = req.body.name;
      if (req.body.email) foundUser.email = req.body.email;
      if (req.body.about) foundUser.about = req.body.about;
      const savedUser = await foundUser.save();
      if (savedUser) {
        return res
          .status(200)
          .json({ message: 'User details successfully updated' });
      } else {
        return res.status(400).json({ message: 'Could not update user' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getLogOut = async (req, res) => {
  try {
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserSettings = async (req, res) => {
  try {
    return res.status(200).json({ customWork: req.user.customWork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      let current = req.body.current;
      let change = req.body.password;
      let confirm = req.body.confirm;
      if (current && change && confirm) {
        if (foundUser.comparePassword(current)) {
          if (change === confirm) {
            foundUser.password = change;
            const updatedUser = await foundUser.save();
            if (updatedUser) {
              return res
                .status(200)
                .json({ message: 'Password updated successfully' });
            } else {
              return res
                .status(400)
                .json({ message: 'Could not update password' });
            }
          } else {
            return res
              .status(400)
              .json({ message: 'New passwords do not match' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Current password incorrect' });
        }
      } else {
        return res
          .status(400)
          .json({ message: 'All fields need to be filled out' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserPreferences = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.user._id });
    if (foundUser) {
      let customWork = req.body.work;
      if (customWork) {
        foundUser.customWork = true;
      } else {
        foundUser.customWork = false;
      }
      const updatedUser = await foundUser.save();
      if (updatedUser) {
        return res
          .status(200)
          .json({ message: 'Preferences updated successfully' });
      } else {
        return res
          .status(400)
          .json({ message: 'Could not update preferences' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  getFacebookLogIn,
  getFacebookCallback,
  getGoogleLogIn,
  getGoogleCallback,
  getUserProfile,
  updateUserProfile,
  getLogOut,
  getUserSettings,
  updateUserPassword,
  updateUserPreferences
};
