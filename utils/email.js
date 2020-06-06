import nodemailer from 'nodemailer';
import config from '../config/mailer.js';
import createError from 'http-errors';

const sendEmail = async (sender, receiver, subject, html) => {
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
    console.log(err);
    throw createError(400, 'Email failed to send');
  }
};

export default {
  sendEmail,
};
