import express from 'express';
import { requestHandler as handler } from '../../../utils/helpers.js';
import search from '../../../controllers/search.js';

const router = express.Router();

router.route('/search').get(
  handler(search.getResults, false, (req, res, next) => ({
    query: req.query.query,
    type: req.query.type,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

export default router;
