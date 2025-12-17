const express = require('express');
const router = express.Router();
const { getGames, buyGames, getTopGames, getGamesByTags, getGameById, getUserLibrary } = require('../controllers/gameController');

router.get('/top', getTopGames);
router.get('/library', getUserLibrary);
router.get('/by-tags', getGamesByTags);
router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/buy', buyGames);

module.exports = router;
