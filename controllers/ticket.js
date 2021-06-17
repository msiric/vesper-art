import { ticketValidation } from "../common/validation";
import { addNewTicket } from "../services/postgres/ticket.js";
import { sendEmail } from "../utils/email.js";
import { generateUuids } from "../utils/helpers.js";

// how to handle transactions?
// treba sredit
export const postTicket = async ({
  userId,
  userEmail,
  ticketTitle,
  ticketBody,
  connection,
}) => {
  await ticketValidation.validate({ ticketTitle, ticketBody });
  const { ticketId } = generateUuids({
    ticketId: null,
  });
  const savedTicket = await addNewTicket({
    ticketId,
    userId,
    ticketTitle,
    ticketBody,
    connection,
  });
  await sendEmail({
    emailReceiver: userEmail,
    emailSubject: `Support ticket (#${ticketId}): ${ticketTitle}`,
    emailContent: ticketBody,
  });
  return { message: "Ticket successfully created" };
};
