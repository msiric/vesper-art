import { Ticket } from "../../entities/Ticket";

// $Needs testing (mongo -> postgres)
export const addNewTicket = async ({ userId, ticketTitle, ticketBody }) => {
  /*   const newTicket = new Ticket();
  newTicket.owner = userId;
  newTicket.title = ticketTitle;
  newTicket.body = ticketBody;
  newTicket.attachment = ""; // $TODO
  newTicket.status = "In progress";
  return await Ticket.save(newTicket); */

  const savedTicket = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Ticket)
    .values([
      {
        owner: userId,
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
