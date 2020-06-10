import mongoose from 'mongoose';
import mailer from '../utils/email.js';
import { createNewTicket } from '../services/ticket.js';
import createError from 'http-errors';

// how to handle transactions?
// treba sredit
const postTicket = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { ticketTitle, ticketBody } = req.body;

    if ((userEmail, ticketTitle, ticketBody)) {
      await createNewTicket({
        userId: res.locals.user.id,
        ticketTitle,
        ticketBody,
      });
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
