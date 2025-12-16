const express = require('express');
const router = express.Router();
const { signup, verifyEmail, googleAuth, verify, release } = require('../controllers/authController');

// Website Auth
router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/google', googleAuth);

// App Auth
router.post('/verify', verify);
router.post('/release', release);

module.exports = router;
