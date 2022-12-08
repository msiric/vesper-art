import createError from "http-errors";
import nodemailer from "nodemailer";
import { appName, appPalette } from "../common/constants";
import { mailer } from "../config/secret";
import { formatError } from "./helpers";
import { errors } from "./statuses";

export const sendEmail = async ({
  emailSender = mailer.sender,
  emailReceiver,
  emailSubject,
  emailContent,
  emailAttachments,
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
      attachments: emailAttachments,
    };
    const sentEmail = await smtpTransport.sendMail(mailOptions);
    return sentEmail;
  } catch (err) {
    throw createError(...formatError(errors.emailNotSent));
  }
};

export const formatEmailContent = ({
  replacementValues,
  replacementAttachments,
}) => {
  const formattedProps = {
    logo: `cid:logo@${appName}.com`,
    banner: `cid:banner@${appName}.com`,
    primary: appPalette.primary.main,
    secondary: "#1f1f1f",
    app: appName,
    date: new Date().getFullYear(),
    ...replacementValues,
  };
  const formattedAttachments = [
    {
      filename: "logo.png",
      path: "common/assets/logo.png",
      cid: `logo@${appName}.com`,
    },
    {
      filename: "banner.jpg",
      path: "common/assets/banner.jpg",
      cid: `banner@${appName}.com`,
    },
    ...replacementAttachments,
  ];
  return { formattedProps, formattedAttachments };
};
