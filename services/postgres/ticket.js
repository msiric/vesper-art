import { Ticket } from "../../entities/Ticket";

// $Needs testing (mongo -> postgres)
export const addNewTicket = async ({
  ticketId,
  userId,
  ticketTitle,
  ticketBody,
  connection,
}) => {
  /*   const newTicket = new Ticket();
  newTicket.owner = userId;
  newTicket.title = ticketTitle;
  newTicket.body = ticketBody;
  newTicket.attachment = ""; // $TODO
  newTicket.status = "In progress";
  return await Ticket.save(newTicket); */

  const savedTicket = await connection
    .createQueryBuilder()
    .insert()
    .into(Ticket)
    .values([
      {
        id: ticketId,
        ownerId: userId,
        title: ticketTitle,
        body: ticketBody,
        attachment: "", // $TODO
        status: "In progress",
      },
    ])
    .execute();
  console.log(savedTicket);
  return savedTicket;
};
