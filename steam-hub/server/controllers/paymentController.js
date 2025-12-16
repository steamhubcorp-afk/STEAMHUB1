const Payment = require('../models/Payment');
const Library = require('../models/Library');
const User = require('../models/User');

// @desc    Process a Payment
// @route   POST /api/payments
// @access  Public (should be protected in prod)
const processPayment = async (req, res) => {
    // items: [{ gameId, amount, hours }]
    let { userId, items, totalAmount, transactionId } = req.body;

    // Normalize items to array if single object passed
    if (items && !Array.isArray(items)) {
        items = [items];
    }

    if (!userId || !items || items.length === 0 || !transactionId) {
        return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    try {
        // 1. Create Payment Record
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

        // 2. Update Library
        let library = await Library.findOne({ user: userId });

        if (!library) {
            library = await Library.create({ user: userId, games: [] });
            // Link to User if not present
            await User.findByIdAndUpdate(userId, { library: library._id });
        }

        const now = new Date();

        items.forEach(item => {
            const durationMs = item.hours * 60 * 60 * 1000;

            // Check if game already exists in library
            const existingGameIndex = library.games.findIndex(g => g.game.toString() === item.gameId);

            if (existingGameIndex > -1) {
                // Extend Expiration
                // If currently active/not expired, add to existing date. Else, start from now.
                let baseDate = library.games[existingGameIndex].expirationDate;
                if (baseDate < now) baseDate = now;

                library.games[existingGameIndex].expirationDate = new Date(baseDate.getTime() + durationMs);
                library.games[existingGameIndex].isActive = true;
            } else {
                // Add New
                library.games.push({
                    game: item.gameId,
                    expirationDate: new Date(now.getTime() + durationMs),
                    isActive: true
                });
            }
        });

        await library.save();

        res.status(201).json({
            success: true,
            message: 'Payment processed and library updated',
            paymentId: payment._id
        });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ success: false, message: 'Server Error processing payment' });
    }
};

module.exports = { processPayment };
