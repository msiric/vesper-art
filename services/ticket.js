import mongoose from 'mongoose';
import Ticket from '../models/ticket.js';

export const createNewTicket = async ({
  userId,
  ticketTitle,
  ticketBody,
  session = null,
}) => {
  const newTicket = new Ticket();
  newTicket.owner = userId;
  newTicket.title = ticketTitle;
  newTicket.body = ticketBody;
  newTicket.resolved = false;
  return await newTicket.save();
};
