const Game = require('../models/Game');

// @desc    Upload new games or update existing ones based on steam_id
// @route   POST /api/admin/upload-games
// @access  Public (for now, or Admin protected later)
exports.uploadGames = async (req, res) => {
    try {
        const gamesData = Array.isArray(req.body) ? req.body : [req.body];

        if (gamesData.length === 0) {
            return res.status(400).json({ message: 'No game data provided' });
        }

        const results = [];
        const errors = [];

        for (const gameData of gamesData) {
            try {
                // If steam_id is present, try to upsert (update if exists, insert if not)
                // If no steam_id, just create (but our schema makes steam_id unique sparse, so be careful)

                if (gameData.steam_id) {
                    const game = await Game.findOneAndUpdate(
                        { steam_id: gameData.steam_id },
                        gameData,
                        { new: true, upsert: true, runValidators: true }
                    );
                    results.push(game);
                } else {
                    // Create new if no steam_id (though likely not desired for this tool, but standard fallback)
                    const game = await Game.create(gameData);
                    results.push(game);
                }
            } catch (err) {
                console.error(`Error processing game ${gameData.name || 'unknown'}:`, err);
                errors.push({
                    name: gameData.name,
                    error: err.message
                });
            }
        }

        res.status(200).json({
            message: `Processed ${gamesData.length} games`,
            successCount: results.length,
            errorCount: errors.length,
            results,
            errors
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
