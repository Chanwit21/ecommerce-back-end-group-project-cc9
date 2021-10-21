const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { upload } = require('../middleware/multer');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/login/google', authController.loginWithGoogle);
router.post('/login/facebook', authController.loginWithFacebook);

module.exports = router;
