import createError from "http-errors";
import { ticketValidation } from "../common/validation";
import { addNewTicket } from "../services/postgres/ticket.js";
import { sendEmail } from "../utils/email.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";

// how to handle transactions?
// treba sredit
export const postTicket = async ({
  userId,
  userEmail,
  ticketTitle,
  ticketBody,
}) => {
  const { error } = await ticketValidation.validate(
    sanitizeData({ ticketTitle, ticketBody })
  );
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
