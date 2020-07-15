import nodemailer from 'nodemailer';
import { mailer } from '../config/secret.js';
import createError from 'http-errors';

export const sendEmail = async ({
  emailSender,
  emailReceiver,
  emailSubject,
  emailContent,
}) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: mailer.email,
        pass: mailer.password,
      },
    });
    const mailOptions = {
      from: emailSender,
      to: emailReceiver,
      subject: emailSubject,
      html: emailContent,
    };
    await smtpTransport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    throw createError(400, 'Email failed to send');
  }
};
