import { Ticket } from "../../entities/Ticket";

export const addNewTicket = async ({
  ticketId,
  userId,
  ticketTitle,
  ticketBody,
  connection,
}) => {
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
