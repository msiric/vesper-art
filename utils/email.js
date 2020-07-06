import nodemailer from 'nodemailer';
import { mailer } from '../config/secret.js';
import createError from 'http-errors';

const sendEmail = async (sender, receiver, subject, html) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: mailer.email,
        pass: mailer.password,
      },
    });
    const mailOptions = {
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
