import mongoose from 'mongoose';
import mailer from '../utils/email.js';
import { addNewTicket } from '../services/ticket.js';
import createError from 'http-errors';

// how to handle transactions?
// treba sredit
const postTicket = async ({ userEmail, ticketTitle, ticketBody }) => {
  if ((userEmail, ticketTitle, ticketBody)) {
    await addNewTicket({
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
    return { message: 'Ticket successfully sent' };
  }
  throw createError(400, 'All fields are required');
};

export default {
  postTicket,
};
