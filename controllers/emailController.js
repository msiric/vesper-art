const nodemailer = require('nodemailer');
const config = require('../config/mailer');
const User = require('../models/user');
const crypto = require('crypto');

function postTicket(req, res, next) {
  let mailOptions, host, link;
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email,
      pass: config.password
    }
  });
  host = req.get('host');
  mailOptions = {
    from: res.locals.email.sender,
    to: config.email,
    subject: `Support ticket (#${res.locals.email.id}): ${res.locals.email.title}`,
    html: res.locals.email.body
  };
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      return res.status(400).json({ message: 'Email could not be sent' });
    } else {
      return res.status(200).json('Email sent successfully');
    }
  });
}

const sendConfirmation = (req, res) => {
  try {
    let mailOptions, host, link;
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password
      }
    });
    host = req.get('host');
    recipient = req.body.email;
    token = req.body.token;
    if (recipient && token) {
      link = 'http://' + req.get('host') + '/verify/' + token;
      mailOptions = {
        from: 'vesper',
        to: recipient,
        subject: 'Please confirm your email',
        html:
          'Hello,<br>Please click on the link to verify your email.<br><a href=' +
          link +
          '>Click here to verify</a>'
      };
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          return res.status(400).json({ message: 'Email could not be sent' });
        } else {
          return res.redirect('/');
        }
      });
    } else {
      return res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ secretToken: req.params.token });
    if (foundUser) {
      foundUser.secretToken = null;
      foundUser.verified = true;
      const savedUser = await foundUser.save();
      if (savedUser) {
        return res.redirect('/login');
      } else {
        return res
          .status(400)
          .json({ message: 'Could not update user verification' });
      }
    } else {
      return res
        .status(500)
        .json({ message: 'Verification token could not be found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    crypto.randomBytes(20, async function(err, buf) {
      var token = buf.toString('hex');
      const foundUser = await User.findOne({ email: req.body.email });
      if (!foundUser) {
        return res
          .status(400)
          .json({ message: 'No account with that email address exists' });
      }
      foundUser.resetPasswordToken = token;
      foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      const savedUser = await foundUser.save();
      if (savedUser) {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: config.email,
            pass: config.password
          }
        });
        mailOptions = {
          from: 'vesper',
          to: foundUser.email,
          subject: 'Reset your password',
          html:
            'You are receiving this because you have requested to reset the password for your account.<br>' +
            'Please click on the following link, or paste this into your browser to complete the process:<br><br>' +
            '<a href="http://' +
            req.headers.host +
            '/reset/' +
            token +
            '"</a><br>' +
            'If you did not request this, please ignore this email and your password will remain unchanged.'
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if (error) {
            return res.status(400).json({ message: 'Could not send email' });
          } else {
            return res.redirect('/');
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: 'Could not update user password' });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getToken = async (req, res) => {
  if (!req.user) {
    const foundUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!foundUser) {
      return res
        .status(400)
        .json({ message: 'Token is invalid or has expired' });
    } else {
      return res.redirect('/login');
    }
  } else {
    res.redirect('/');
  }
};

const resendToken = async (req, res) => {
  try {
    const foundUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!foundUser) {
      return res
        .status(400)
        .json({ message: 'Token is invalid or has expired' });
    } else if (req.body.password !== req.body.confirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    } else if (user.password === req.body.password) {
      return res
        .status(400)
        .json({ message: 'Password is identical to the old one' });
    } else {
      foundUser.password = req.body.password;
      foundUser.resetPasswordToken = null;
      foundUser.resetPasswordExpires = null;

      const savedUser = await foundUser.save(function(err) {
        req.logIn(foundUser, function(err) {
          callback(err, foundUser);
        });
      });
    }
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password
      }
    });
    mailOptions = {
      from: 'vesper',
      to: foundUser.email,
      subject: 'Password change',
      html:
        'You are receiving this because you just changed your password <br><br> If you did not request this, please contact us immediately.'
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        return res
          .status(400)
          .json({ message: 'Something went wrong, please try again' });
      } else {
        return res.redirect('/login');
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postTicket,
  sendConfirmation,
  verifyToken,
  forgotPassword,
  getToken,
  resendToken
};
