const express = require('express');
const router = express.Router();
const { login } = require('../controllers/appController');

// App Auth Routes
router.post('/login', login);

module.exports = router;
