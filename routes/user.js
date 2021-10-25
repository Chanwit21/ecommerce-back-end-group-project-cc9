const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/login/google', authController.loginWithGoogle);
router.post('/login/facebook', authController.loginWithFacebook);

module.exports = router;
