const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');

// Process Payment
router.post('/', processPayment);

module.exports = router;
