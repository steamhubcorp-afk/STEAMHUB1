const express = require('express');
const router = express.Router();
const { uploadGames } = require('../controllers/adminController');

router.post('/upload-games', uploadGames);

module.exports = router;
