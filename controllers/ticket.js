import createError from "http-errors";
import { addNewTicket } from "../services/postgres/ticket.js";
import { sendEmail } from "../utils/email.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";
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
  const { ticketId } = generateUuids({
    ticketId: null,
  });
  const savedTicket = await addNewTicket({
    ticketId,
    userId,
    ticketTitle,
    ticketBody,
  });
  await sendEmail({
    emailReceiver: userEmail,
    emailSubject: `Support ticket (#${savedTicket.id}): ${ticketTitle}`,
    emailContent: ticketBody,
  });
  return { message: "Ticket successfully created" };
};
