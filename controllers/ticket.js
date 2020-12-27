import createError from "http-errors";
import { addNewTicket } from "../services/mongo/ticket.js";
import { sendEmail } from "../utils/email.js";
import { sanitizeData } from "../utils/helpers.js";
import ticketValidator from "../validation/ticket.js";

// how to handle transactions?
// treba sredit
export const postTicket = async ({
  userId,
  userEmail,
  ticketTitle,
  ticketBody,
}) => {
  const { error } = ticketValidator(sanitizeData({ ticketTitle, ticketBody }));
  if (error) throw createError(400, error);
  await addNewTicket({
    userId,
    ticketTitle,
    ticketBody,
  });
  const ticketId = savedTicket.id;
  await sendEmail({
    emailReceiver: userEmail,
    emailSubject: `Support ticket (#${ticketId}): ${ticketTitle}`,
    emailContent: ticketBody,
  });
  return { message: "Ticket successfully sent" };
};
