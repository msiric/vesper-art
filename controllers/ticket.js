import mongoose from 'mongoose';
import mailer from '../utils/email.js';
import { addNewTicket } from '../services/ticket.js';
import ticketValidator from '../utils/validation/ticket.js';
import { sanitizeData } from '../utils/helpers.js';
import createError from 'http-errors';

// how to handle transactions?
// treba sredit
const postTicket = async ({ userId, userEmail, ticketTitle, ticketBody }) => {
  const { error } = ticketValidator(sanitizeData({ ticketTitle, ticketBody }));
  if (error) throw createError(400, error);
  await addNewTicket({
    userId,
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
};

export default {
  postTicket,
};
