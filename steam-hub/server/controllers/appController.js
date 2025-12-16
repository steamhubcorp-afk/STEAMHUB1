const User = require('../models/User');

// @desc    App Login (Desktop)
// @route   POST /api/app/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body; // machineId no longer used for locking

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    try {
        console.log(`[APP-AUTH] Login attempt: ${email}`);
        const normalizedEmail = email.toLowerCase();

        // Populate library to check for games. Deep populate games.game to get details
        const user = await User.findOne({ email: normalizedEmail })
            .populate({
                path: 'library',
                populate: { path: 'games.game' }
            });

        if (!user) {
            console.log(`[APP-AUTH] User not found: ${normalizedEmail}`);
            return res.status(401).json({ success: false, message: 'Invalid Credentials (User)' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`[APP-AUTH] Password mismatch for: ${normalizedEmail}`);
            return res.status(401).json({ success: false, message: 'Invalid Credentials (Pass)' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'Email not verified. Please check your inbox.' });
        }

        // --- Logic: Library Check & Cleanup --- //
        if (!user.library) {
            console.log(`[APP-AUTH] User ${normalizedEmail} has no library.`);
            return res.status(403).json({ success: false, message: 'You have no games. Please visit the website.' });
        }

        const now = new Date();
        const initialCount = user.library.games.length;

        // Filter out expired games
        user.library.games = user.library.games.filter(g => {
            const isExpired = new Date(g.expirationDate) <= now;
            return !isExpired && g.isActive;
        });

        // Save if changes happened
        if (user.library.games.length !== initialCount) {
            console.log(`[APP-AUTH] Removed ${initialCount - user.library.games.length} expired/inactive games for ${normalizedEmail}`);
            await user.library.save();
        }

        // Check availability after cleanup
        if (user.library.games.length === 0) {
            console.log(`[APP-AUTH] User ${normalizedEmail} has empty library (after cleanup).`);
            return res.status(403).json({
                success: false,
                message: 'You have no active games. Subscriptions may have expired.'
            });
        }

        // Map games for App Response
        const gamesList = user.library.games.map(item => ({
            Title: item.game.name,
            ImagePath: item.game.images.main,
            BannerPath: item.game.images.banner,
            Description: item.game.about,
            Developer: item.game.developer,
            ExpirationDate: item.expirationDate
        }));

        // --- Success --- //
        // Machine Lock & Expiration logic REMOVED as requested.

        res.json({
            success: true,
            message: 'App Login Successful',
            config: {
                userName: user.name,
                games: gamesList
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { login };
