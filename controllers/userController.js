const aws = require('aws-sdk');
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
      user.photo = user.gravatar();
      user.password = req.body.password;
      user.customWork = true;
      user.secretToken = verificationInfo.token;
      user.verified = false;
      user.cart = [];
      user.discount = null;
      user.inbox = 0;
      user.notifications = 0;
      user.rating = null;
      user.reviews = 0;
      user.savedArtwork = [];
      user.earnings = 0;
      user.incomingFunds = 0;
      user.outgoingFunds = 0;
      user.active = true;
      const savedUser = await user.save();
      if (savedUser) {
        try {
          const sentEmail = await axios.post(
            'http://localhost:3000/send_email',
            verificationInfo,
            {
              proxy: false
            }
          );
          console.log(`statusCode: ${res.statusCode}`);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
        // old code
        /*         axios
          .post('http://localhost:3000/send_email', verificationInfo, {
            proxy: false
          })
          .then(res => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log(res);
          })
          .catch(error => {
            console.error(error);
          }); */
        return res.redirect('/signup');
      } else {
        return res.status(400).json({ message: 'Could not create account' });
      }
    }
  } catch (err) {
    console.log(err);
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

const postLogIn = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

const getFacebookLogIn = passport.authenticate('facebook', { scope: 'email' });

const getFacebookCallback = passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

const getGoogleLogIn = passport.authenticate('google', { scope: 'email' });

const getGoogleCallback = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

const getUserProfile = async (req, res, next) => {
  try {
    res.render('accounts/profile', { message: req.flash('success') });
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
    return res
      .status(200)
      .render('accounts/settings', { customWork: req.user.customWork });
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

// needs testing (better way to update already found user)
// delete all users artwork, versions and media if not found in orders
const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: req.user._id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.photo.includes(foundUser._id)) {
        const folderName = 'profilePhotos/';
        const fileName = foundUser.photo.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { _id: foundUser._id },
        {
          $set: {
            email: null,
            name: 'Deleted User',
            password: null,
            photo: foundUser.gravatar(),
            about: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            secretToken: null,
            verified: false,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            cart: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            savedArtwork: null,
            earnings: null,
            incomingFunds: null,
            outgoingFunds: null,
            escrow: null,
            active: false
          }
        }
      );
      if (updatedUser) {
        req.logout();
        req.session.destroy(function(err) {
          res.status(200).json('/');
        });
      } else {
        return res.status(400).json({ message: 'User could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
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
  updateUserPreferences,
  deleteUser
};
