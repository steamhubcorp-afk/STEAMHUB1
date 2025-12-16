const Game = require('../models/Game');
const User = require('../models/User');
const { generateUserPayload } = require('../services/payloadService');

// @desc    Get All Games
// @route   GET /api/games
const getGames = async (req, res) => {
    try {
        const games = await Game.find({ isEnabled: true });
        res.json({ success: true, games });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Buy Games (Bulk)
// @route   POST /api/games/buy
const buyGames = async (req, res) => {
    const { userId, gameIds } = req.body;

    if (!userId || !gameIds || !Array.isArray(gameIds)) {
        return res.status(400).json({ success: false, message: 'Missing user or gameIds array' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Filter out games already owned
        const newGameIds = gameIds.filter(id => !user.ownedGames.includes(id));

        if (newGameIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No new games to add' });
        }

        // Verify games exist
        const validGamesCount = await Game.countDocuments({ _id: { $in: newGameIds } });
        if (validGamesCount !== newGameIds.length) {
            return res.status(404).json({ success: false, message: 'One or more Game IDs are invalid' });
        }

        // --- PAYMENT LOGIC HERE ---
        // (Mocking success)
        console.log(`[PAYMENT] User ${user.email} bought ${newGameIds.length} games.`);

        // Add to library
        user.ownedGames.push(...newGameIds);
        await user.save();

        // Regenerate Payload
        console.log(`[GAME] Regenerating payload for ${user.email}...`);
        const payloadFile = await generateUserPayload(userId);

        res.json({
            success: true,
            message: 'Games Purchased',
            payloadUrl: `/payloads/${payloadFile}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getGames, buyGames };
