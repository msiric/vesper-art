const Ticket = require('../models/ticket');
const emailController = require('./emailController');

const getSupport = async (req, res, next) => {
  try {
    res.render('main/support');
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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
      if (savedTicket) {
        id = savedTicket._id;
        res.locals.email = { id, sender, title, body };
        emailController.postTicket(req, res, next);
      } else {
        return res.status(400).json({ message: 'Could not save the ticket' });
      }
    } else {
      return res.status(400).json({ message: 'All fields are required' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSupport,
  postTicket
};
