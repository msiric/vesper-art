import express from 'express';
import { requestHandler as handler } from '../../../utils/helpers.js';
import { verifyLicense } from '../../../controllers/verifier.js';

const router = express.Router();

router.route('/verifier').post(
  handler(verifyLicense, false, (req, res, next) => ({
    ...req.body,
  }))
);

export default router;
