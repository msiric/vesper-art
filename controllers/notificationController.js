const Notification = require('../models/notification');

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await Notification.find({
      receivers: { $elemMatch: { user: res.locals.user.id } }
    })
      .populate('user')
      .sort({ created: -1 });
    res.json({ notification: foundNotifications });
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  getNotifications
};
