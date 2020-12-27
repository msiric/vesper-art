import { Ticket } from "../../entities/Ticket";

// $Needs testing (mongo -> postgres)
export const addNewTicket = async ({ userId, ticketTitle, ticketBody }) => {
  const newTicket = new Ticket();
  newTicket.owner = userId;
  newTicket.title = ticketTitle;
  newTicket.body = ticketBody;
  newTicket.attachment = ""; // $TODO
  newTicket.status = "In progress";
  return await Ticket.save(newTicket);
};
