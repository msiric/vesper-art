const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const emailController = require('./emailController');
const createError = require('http-errors');

// how to handle transactions?
// treba sredit
const postTicket = async (req, res, next) => {
  try {
    let id;
    const sender = req.user.email;
    const { title, body } = req.body;

    if ((sender, title, body)) {
      const newTicket = new Ticket();
      newTicket.owner = req.user._id;
      newTicket.title = title;
      newTicket.body = body;
      newTicket.resolved = false;
      const savedTicket = await newTicket.save();
      id = savedTicket._id;
      res.locals.email = { id, sender, title, body };
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
  postTicket
};
