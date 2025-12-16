const express = require('express');
const router = express.Router();
const { getGames, buyGames } = require('../controllers/gameController');

router.get('/', getGames);
router.post('/buy', buyGames);

module.exports = router;
