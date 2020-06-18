import mongoose from 'mongoose';
import Work from '../models/work.js';
import createError from 'http-errors';

const getUserCustomWork = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const foundWork = await Work.findOne({ _id: workId })
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

export default {
  getUserCustomWork,
};
