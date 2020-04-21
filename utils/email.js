const nodemailer = require('nodemailer');
const config = require('../config/mailer');
const createError = require('http-errors');

const sendEmail = async ({ sender, receiver, subject, html }) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    mailOptions = {
      from: sender,
      to: receiver,
      subject,
      html,
    };
    await smtpTransport.sendMail(mailOptions);
  } catch (err) {
    throw createError(400, 'Email failed to send');
  }
};

module.exports = {
  sendEmail,
};
