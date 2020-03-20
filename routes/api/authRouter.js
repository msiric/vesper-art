const router = require('express').Router();
const authController = require('../../controllers/authController');

router.post('/refresh_token', authController.postRefreshToken);

router.post('/revoke_token/:id', authController.postRevokeToken);

module.exports = router;
