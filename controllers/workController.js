const mongoose = require('mongoose');
const Work = require('../models/work');
const createError = require('http-errors');

const getUserCustomWork = async (req, res, next) => {
  try {
    req.session.workId = req.params.workId;
    const foundWork = await Work.findOne({ _id: req.params.workId })
      .populate('buyer')
      .populate('seller')
      .deepPopulate('messages.owner');
    if (foundWork) {
      return res.json({ work: foundWork });
    } else {
      throw createError(400, 'Custom work not found');
    }
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  getUserCustomWork
};
