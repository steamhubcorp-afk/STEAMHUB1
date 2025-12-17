const express = require('express');
const router = express.Router();
const { login, logout, loginWithToken } = require('../controllers/appController');
const { downloadApp } = require('../controllers/downloadController');
const User = require('../models/User');

// Simple middleware to populate req.user from token/cookie/session
// Since the project structure is a bit custom, adhering to the "use token" request
const protect = async (req, res, next) => {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies (if used)
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        // User specified to NOT use JWT verification, but to check the token saved in database.
        // authController saves the generated token to user.token.
        // So we find the user by this token directly.

        const user = await User.findOne({ token: token }).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// App Auth Routes
router.post('/login', login);
router.post('/login-token', loginWithToken);
router.post('/logout', logout);

// Protected Download Route
router.get('/download', protect, downloadApp);

module.exports = router;
