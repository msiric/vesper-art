const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const emailController = require('./emailController');
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
      res.locals.email = { ticketId, userEmail, ticketTitle, ticketBody };
      emailController.postTicket(req, res, next);
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
