const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { upload } = require('../middleware/multer');

router.post('/login', authController.login);
router.post('/register', upload.single('profile_image'), authController.register);

module.exports = router;
