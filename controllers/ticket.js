// how to handle transactions?
// treba sredit
/* export const postTicket = async ({
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
  return { message: "Ticket successfully created", expose: true };
}; */
