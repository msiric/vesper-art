import Ticket from "../../models/ticket.js";

export const addNewTicket = async ({
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
