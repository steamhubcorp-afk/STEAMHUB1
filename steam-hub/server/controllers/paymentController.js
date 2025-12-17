const Payment = require('../models/Payment');
const Library = require('../models/Library');
const User = require('../models/User');

// @desc    Process a Payment
// @route   POST /api/payments
// @access  Public (should be protected in prod)
const processPayment = async (req, res) => {
    console.log("Payment Request Body:", req.body);
    // items: [{ gameId, amount, hours }]
    let { userId, items, totalAmount, transactionId } = req.body;

    // Normalize items to array if single object passed
    if (items && !Array.isArray(items)) {
        items = [items];
    }

    if (!userId || !items || items.length === 0 || !transactionId) {
        console.error("Missing Fields:", { userId, items, transactionId });
        return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    try {
        console.log(`[PAYMENT] Processing for User: ${userId}`);

        // 1. Create Payment Record in Database
        const payment = await Payment.create({
            user: userId,
            games: items.map(item => ({
                game: item.gameId,
                amount: item.amount,
                hours: item.hours
            })),
            totalAmount: totalAmount,
            transactionId: transactionId,
            status: 'completed'
        });

        console.log(`[PAYMENT] Success! ID: ${payment._id}`);

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            paymentId: payment._id
        });

    } catch (error) {
        console.error("Payment Process Error:", error);
        if (error.name === 'ValidationError') {
            console.error("Validation Details:", error.errors);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ success: false, message: 'Server Error processing payment' });
    }
};

module.exports = { processPayment };
