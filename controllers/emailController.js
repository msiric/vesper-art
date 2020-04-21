const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('../config/mailer');
const User = require('../models/user');
const crypto = require('crypto');
const createError = require('http-errors');

function postTicket(req, res, next) {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    const mailOptions = {
      from: res.locals.email.sender,
      to: config.email,
      subject: `Support ticket (#${res.locals.email.id}): ${res.locals.email.title}`,
      html: res.locals.email.body,
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw createError(400, 'Email could not be sent');
      } else {
        return res.status(200).json('Email sent successfully');
      }
    });
  } catch (err) {
    next(err, res);
  }
}

const sendConfirmation = (req, res) => {
  try {
    const { email, token } = req.body;
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    const host = req.get('host');
    if (email && token) {
      const link = `http://${host}/verify/${token}`;
      const mailOptions = {
        from: 'vesper',
        to: email,
        subject: 'Please confirm your email',
        html: `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`,
      };
      smtpTransport.sendMail(mailOptions, function (error, response) {
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
    next(err, res);
  }
};

// needs transaction (not tested)
const verifyToken = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tokenId } = req.params;
    const foundUser = await User.findOne({
      secretToken: tokenId,
    }).session(session);
    if (foundUser) {
      foundUser.secretToken = null;
      foundUser.verified = true;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res.redirect('/login');
    } else {
      throw createError(400, 'Verification token could not be found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (not tested)
const forgotPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email } = req.body;
    crypto.randomBytes(20, async function (err, buf) {
      const token = buf.toString('hex');
      const foundUser = await User.findOne({ email: email }).session(session);
      if (!foundUser) {
        throw createError(400, 'No account with that email address exists');
      }
      foundUser.resetPasswordToken = token;
      foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await foundUser.save({ session });
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: config.email,
          pass: config.password,
        },
      });
      mailOptions = {
        from: 'vesper',
        to: foundUser.email,
        subject: 'Reset your password',
        html: `You are receiving this because you have requested to reset the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          
          <a href="http://${req.headers.host}/reset/${token}"</a>`,
      };
      smtpTransport.sendMail(mailOptions, async function (error, response) {
        if (error) {
          throw createError(400, 'Could not send email');
        } else {
          await session.commitTransaction();
          return res.redirect('/');
        }
      });
    });
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// treba sredit?
const getToken = async (req, res) => {
  try {
    if (!req.user) {
      const { tokenId } = req.params;
      const foundUser = await User.findOne({
        resetPasswordToken: tokenId,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!foundUser) {
        throw createError(400, 'Token is invalid or has expired');
      } else {
        return res.redirect('/login');
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (not tested)
const resendToken = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tokenId } = req.params;
    const { password, confirm } = req.body;
    const foundUser = await User.findOne({
      resetPasswordToken: tokenId,
      resetPasswordExpires: { $gt: Date.now() },
    }).session(session);
    if (!foundUser) {
      throw createError(400, 'Token is invalid or has expired');
    } else if (password !== confirm) {
      throw createError(400, 'Passwords do not match');
    } else if (user.password === password) {
      throw createError(400, 'New password is identical to the old one');
    } else {
      foundUser.password = password;
      foundUser.resetPasswordToken = null;
      foundUser.resetPasswordExpires = null;

      await foundUser.save(function (err) {
        req.logIn(foundUser, function (err) {
          callback(err, foundUser);
        });
      });
    }
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    mailOptions = {
      from: 'vesper',
      to: foundUser.email,
      subject: 'Password change',
      html: `You are receiving this because you just changed your password.
        
        If you did not request this, please contact us immediately.`,
    };
    smtpTransport.sendMail(mailOptions, async function (error, response) {
      if (error) {
        throw createError(400, 'Could not send email');
      } else {
        await session.commitTransaction();
        return res.redirect('/login');
      }
    });
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  postTicket,
  sendConfirmation,
  verifyToken,
  forgotPassword,
  getToken,
  resendToken,
};
