import mongoose from 'mongoose';
import Ticket from '../models/ticket.js';
import mailer from '../utils/email.js';
import createError from 'http-errors';

export const createNewTicket = async ({ userId, ticketTitle, ticketBody }) => {
  const newTicket = new Ticket();
  newTicket.owner = userId;
  newTicket.title = ticketTitle;
  newTicket.body = ticketBody;
  newTicket.resolved = false;
  return await newTicket.save();
};
