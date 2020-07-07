import mongoose from "mongoose";
import { sendEmail } from "../utils/email.js";
import { addNewTicket } from "../services/ticket.js";
import ticketValidator from "../validation/ticket.js";
import { sanitizeData } from "../utils/helpers.js";
import createError from "http-errors";

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
  const ticketId = savedTicket._id;
  await sendEmail(
    userEmail,
    config.email,
    `Support ticket (#${ticketId}): ${ticketTitle}`,
    ticketBody
  );
  return { message: "Ticket successfully sent" };
};
