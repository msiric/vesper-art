const router = require('express').Router();
const async = require('async');
const Work = require('../models/work');

router.get('/users/:userId/custom-work/:workId', (req, res, next) => {
  req.session.workId = req.params.workId;
  Work.findOne({ _id: req.params.workId })
    .populate('buyer')
    .populate('seller')
    .deepPopulate('messages.owner')
    .exec(function(err, work) {
      res.render('work/work-room', {
        layout: 'work-chat',
        work: work
      });
    });
});

module.exports = router;
