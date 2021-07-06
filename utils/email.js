import createError from "http-errors";
import nodemailer from "nodemailer";
import { mailer } from "../config/secret";
import { errors } from "./statuses";

export const sendEmail = async ({
  emailSender = mailer.sender,
  emailReceiver,
  emailSubject,
  emailContent,
}) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      // smtp.zoho.com or smtp.zoho.eu for eu data server
      host: mailer.host,
      secure: mailer.secure,
      auth: mailer.auth,
    });
    const mailOptions = {
      from: emailSender,
      to: emailReceiver,
      subject: emailSubject,
      html: emailContent,
    };
    const sentEmail = await smtpTransport.sendMail(mailOptions);
    return sentEmail;
  } catch (err) {
    console.log(err);
    throw createError(...formatError(errors.emailNotSent));
  }
};
