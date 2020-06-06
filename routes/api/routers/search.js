import express from 'express';
import search from '../../../controllers/search.js';

const router = express.Router();

router.route('/search').get(search.getResults);

export default router;
