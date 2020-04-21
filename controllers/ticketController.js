const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const mailer = require('../utils/email');
const createError = require('http-errors');

// how to handle transactions?
// treba sredit
const postTicket = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { ticketTitle, ticketBody } = req.body;

    if ((userEmail, ticketTitle, ticketBody)) {
      const newTicket = new Ticket();
      newTicket.owner = req.user._id;
      newTicket.title = ticketTitle;
      newTicket.body = ticketBody;
      newTicket.resolved = false;
      const savedTicket = await newTicket.save();
      const ticketId = savedTicket._id;
      await mailer.sendEmail(
        userEmail,
        config.email,
        `Support ticket (#${ticketId}): ${ticketTitle}`,
        ticketBody
      );
      await session.commitTransaction();
      res.status(200).json({ message: 'Ticket successfully sent' });
    } else {
      throw createError(400, 'All fields are required');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

module.exports = {
  postTicket,
};
