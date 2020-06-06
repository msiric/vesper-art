import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import work from '../../../controllers/work.js';

const router = express.Router();

router
  .route('/custom_work/:workId')
  .get(isAuthenticated, work.getUserCustomWork);

export default router;
