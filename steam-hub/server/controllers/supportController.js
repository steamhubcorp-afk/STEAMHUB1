const Support = require('../models/Support');
const User = require('../models/User');

// @desc    Create a new support ticket
// @route   POST /api/support/ticket
// @access  Public (or Protected)
const createTicket = async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Try to link to a user if email exists in system
        let userId = null;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            userId = user._id;
        }

        const newTicket = await Support.create({
            user: userId,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            ticketId: newTicket._id
        });

    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createTicket };
