import express from 'express';
import verifier from '../../../controllers/verifier.js';

const router = express.Router();

router.route('/verifier').post(verifier.verifyLicense);

export default router;
