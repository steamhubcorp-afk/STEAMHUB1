const express = require('express');
const router = express.Router();
const { signup, verifyEmail, googleAuth, verify } = require('../controllers/authController');

// Website Auth
router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/google', googleAuth);

// App Auth (Legacy check or shared logic if any)
router.post('/verify', verify);

module.exports = router;
