const Work = require('../models/work');

const getUserCustomWork = async (req, res, next) => {
  try {
    req.session.workId = req.params.workId;
    const foundWork = await Work.findOne({ _id: req.params.workId })
      .populate('buyer')
      .populate('seller')
      .deepPopulate('messages.owner');
    if (foundWork) {
      return res.render('work/work-room', { work: foundWork });
    } else {
      return res.status(400).json({ message: 'Custom work not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserCustomWork
};
