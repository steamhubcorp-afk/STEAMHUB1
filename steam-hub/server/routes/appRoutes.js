const express = require('express');
const router = express.Router();
const { login, logout, loginWithToken } = require('../controllers/appController');

// App Auth Routes
router.post('/login', login);
router.post('/login-token', loginWithToken);
router.post('/logout', logout);

module.exports = router;
