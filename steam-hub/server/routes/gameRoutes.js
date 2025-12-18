const express = require('express');
const router = express.Router();
const { getGames, buyGames, getTopGames, getGamesByTags, getGameById, getUserLibrary, addPlaytime } = require('../controllers/gameController');

router.get('/top', getTopGames);
router.get('/library', getUserLibrary);
router.put('/library/:gameId/playtime', addPlaytime);
router.get('/by-tags', getGamesByTags);
router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/buy', buyGames);

module.exports = router;
