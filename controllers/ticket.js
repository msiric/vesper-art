import mongoose from 'mongoose';
import Ticket from '../models/ticket.js';
import mailer from '../utils/email.js';
import createError from 'http-errors';

// how to handle transactions?
// treba sredit
const postTicket = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { ticketTitle, ticketBody } = req.body;

    if ((userEmail, ticketTitle, ticketBody)) {
      const newTicket = new Ticket();
      newTicket.owner = req.user._id;
      newTicket.title = ticketTitle;
      newTicket.body = ticketBody;
      newTicket.resolved = false;
      const savedTicket = await newTicket.save();
      const ticketId = savedTicket._id;
      await mailer.sendEmail(
        userEmail,
        config.email,
        `Support ticket (#${ticketId}): ${ticketTitle}`,
        ticketBody
      );
      await session.commitTransaction();
      res.status(200).json({ message: 'Ticket successfully sent' });
    } else {
      throw createError(400, 'All fields are required');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

export default {
  postTicket,
};
