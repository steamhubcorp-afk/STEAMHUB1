const Game = require('../models/Game');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Library = require('../models/Library');
const Payment = require('../models/Payment');
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

// @desc    Get User Library
// @route   GET /api/games/library
const getUserLibrary = async (req, res) => {
    // 1. Get Token from Cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized (No Token)' });
    }

    try {
        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        const userId = decoded.id;

        // 3. Fetch Payments (Source of Truth) sorted by Date ASC to calculate extensions correctly
        const payments = await Payment.find({ user: userId, status: 'completed' })
            .sort({ createdAt: 1 })
            .populate('games.game');

        // 4. Calculate Sync State
        const libraryState = new Map(); // gameId -> { expirationDate, gameObj }

        payments.forEach(payment => {
            payment.games.forEach(item => {
                if (!item.game) return;

                const gameId = item.game._id.toString();
                const purchaseDate = new Date(payment.createdAt);
                const durationMs = item.hours * 60 * 60 * 1000;

                // Logic: 
                // If game exists in map and is NOT expired at the time of this new purchase -> Extend it.
                // If game exists but expired -> Restart from purchase date.
                // If game not in map -> Start from purchase date.

                let currentExp = 0;
                if (libraryState.has(gameId)) {
                    currentExp = libraryState.get(gameId).expirationDate.getTime();
                }

                let newExp;
                if (currentExp > purchaseDate.getTime()) {
                    // Active -> Extend
                    newExp = new Date(currentExp + durationMs);
                } else {
                    // Expired or New -> Start Fresh
                    newExp = new Date(purchaseDate.getTime() + durationMs);
                }

                libraryState.set(gameId, {
                    expirationDate: newExp,
                    game: item.game
                });
            });
        });

        // 5. Update Library Database
        let library = await Library.findOne({ user: userId });
        if (!library) {
            library = new Library({ user: userId, games: [] });
        }

        // Rebuild library games list
        library.games = Array.from(libraryState.entries()).map(([id, data]) => ({
            game: id,
            expirationDate: data.expirationDate,
            isActive: data.expirationDate > new Date()
        }));

        await library.save();

        // 6. Return Populated Data for Frontend
        const games = Array.from(libraryState.values())
            .filter(data => data.expirationDate > new Date()) // Only return active to frontend
            .map(data => ({
                id: data.game._id,
                title: data.game.name,
                image: data.game.images.main || data.game.images.banner,
                expirationDate: data.expirationDate
            }));

        res.json({ success: true, games });

    } catch (error) {
        console.error("Get Library Error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid Token' });
        }
        res.status(500).json({ success: false, message: 'Server Error fetching library' });
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

// @desc    Get Top Games for Carousel
// @route   GET /api/games/top
const getTopGames = async (req, res) => {
    try {
        const topGameIds = ["2651280", "271590", "2050650", "2322010"];
        const games = await Game.find({ steam_id: { $in: topGameIds } });

        // Sort to match the specific order if needed, or just return
        // We can create a map to order them strictly
        const gameMap = new Map(games.map(game => [game.steam_id, game]));
        const orderedGames = topGameIds.map(id => gameMap.get(id)).filter(Boolean);

        res.json({ success: true, games: orderedGames });
    } catch (error) {
        console.error("Top Games Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Games by Tags
// @route   GET /api/games/by-tags?tags=top,trending,survival
const getGamesByTags = async (req, res) => {
    try {
        const { tags } = req.query;

        if (!tags) {
            return res.status(400).json({ success: false, message: 'Tags parameter required' });
        }

        // Parse tags (comma-separated string to array)
        const tagArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

        // Find games that have at least one of the requested tags
        const games = await Game.find({
            tags: { $in: tagArray },
            isEnabled: true
        }).select('_id name images.banner about price tags');

        res.json({ success: true, games });
    } catch (error) {
        console.error("Get Games by Tags Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Single Game by ID
// @route   GET /api/games/:id
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        res.json({ success: true, game });
    } catch (error) {
        console.error("Get Game By ID Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getGames, buyGames, getTopGames, getGamesByTags, getGameById, getUserLibrary };
