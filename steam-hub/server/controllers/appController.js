const User = require('../models/User');
const Library = require('../models/Library');
const DeviceActivity = require('../models/DeviceActivity');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// @desc    App Login (Desktop)
// @route   POST /api/app/login
// @access  Public
const login = async (req, res) => {
    const { email, password, deviceId, deviceName } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    // Device ID is required for single-session enforcement
    if (!deviceId) {
        return res.status(400).json({ success: false, message: 'Device ID is required' });
    }

    try {
        console.log(`[APP-AUTH] Login attempt: ${email}`);
        const normalizedEmail = email.toLowerCase();

        // Populate library to check for games. Deep populate games.game to get details
        // Populate library AND activeSession
        const user = await User.findOne({ email: normalizedEmail })
            .populate({
                path: 'library',
                populate: { path: 'games.game' }
            })
            .populate('activeSession');

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

        // --- Logic: Single Device Enforcement --- //
        // Check if there is an ACTIVE session (linked and no logoutTime)
        if (user.activeSession && !user.activeSession.logoutTime) {
            const activeDevice = user.activeSession.deviceId;

            if (activeDevice !== deviceId) {
                console.log(`[APP-AUTH] Blocked login for ${normalizedEmail}. Active on ${activeDevice}, attempting ${deviceId}`);
                return res.status(403).json({
                    success: false,
                    message: 'You are logged in on another device. Please logout from that device first.'
                });
            } else {
                // Same device re-login. Close previous session to maintain clean history.
                console.log(`[APP-AUTH] Re-login on same device ${deviceId}. Closing previous session.`);
                await DeviceActivity.findByIdAndUpdate(user.activeSession._id, { logoutTime: new Date() });
            }
        }

        // Logic moved to after library checks to include appToken


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

        // Create new activity
        const appToken = crypto.randomBytes(32).toString('hex');
        const newActivity = await DeviceActivity.create({
            user: user._id,
            deviceId,
            deviceName: deviceName || 'Unknown',
            ipAddress: req.ip,
            appToken: appToken
        });

        // Set as active session
        user.activeSession = newActivity._id;
        await user.save();

        // Check verification requirement (if needed) - but assuming verified or handled

        // Map games for App Response
        const gamesList = user.library.games.map(item => ({
            Title: item.game.name,
            ImagePath: item.game.images.banner,
            BannerPath: item.game.images.banner,
            Description: item.game.about,
            Developer: item.game.developer,
            GameId: item.game._id,
            SteamId: item.game.steam_id,
        }));

        res.status(200).json({
            success: true,
            appToken: appToken,
            config: {
                userName: user.name,
                games: gamesList
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const loginWithToken = async (req, res) => {
    const { appToken, deviceId } = req.body;

    if (!appToken || !deviceId) {
        return res.status(400).json({ success: false, message: 'Missing token or device info' });
    }

    try {
        const activity = await DeviceActivity.findOne({ appToken }).populate({
            path: 'user',
            populate: {
                path: 'library',
                populate: { path: 'games.game' }
            }
        });

        if (!activity) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        if (activity.deviceId !== deviceId) {
            return res.status(401).json({ success: false, message: 'Token invalid for this device' });
        }

        if (activity.logoutTime) {
            return res.status(401).json({ success: false, message: 'Session expired' });
        }

        const user = activity.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Verify it's still the active session (optional strict check)
        if (user.activeSession && user.activeSession.toString() !== activity._id.toString()) {
            // Maybe session was overridden manually?
            // For now, allow if token matches and not logged out
            // This means the user logged in on another device, invalidating this token as the active session.
            // We should probably force re-login here.
            return res.status(401).json({ success: false, message: 'Session overridden. Please log in again.' });
        }

        // --- Logic: Library Check & Cleanup (similar to login) --- //
        if (!user.library) {
            console.log(`[APP-AUTH] User ${user.email} has no library during token login.`);
            return res.status(403).json({ success: false, message: 'You have no games. Please visit the website.' });
        }

        const now = new Date();
        const initialCount = user.library.games.length;

        user.library.games = user.library.games.filter(g => {
            const isExpired = new Date(g.expirationDate) <= now;
            return !isExpired && g.isActive;
        });

        if (user.library.games.length !== initialCount) {
            console.log(`[APP-AUTH] Removed ${initialCount - user.library.games.length} expired/inactive games for ${user.email} during token login`);
            await user.library.save();
        }

        if (user.library.games.length === 0) {
            console.log(`[APP-AUTH] User ${user.email} has empty library (after cleanup) during token login.`);
            return res.status(403).json({
                success: false,
                message: 'You have no active games. Subscriptions may have expired.'
            });
        }


        const gamesList = user.library.games.map(item => ({
            Title: item.game.name,
            ImagePath: item.game.images.banner,
            BannerPath: item.game.images.banner,
            Description: item.game.about,
            Developer: item.game.developer,
            GameId: item.game._id,
            SteamId: item.game.steam_id,
        }));

        res.status(200).json({
            success: true,
            appToken: appToken, // Echo back or new? Keep same.
            config: {
                userName: user.name,
                games: gamesList
            }
        });

    } catch (error) {
        console.error('Token Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    App Logout
// @route   POST /api/app/logout
// @access  Public (Protected by logic if needed, but here we just need email or ID to clear)
const logout = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required for logout' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Close the active session if it exists
        if (user.activeSession) {
            await DeviceActivity.findByIdAndUpdate(user.activeSession, { logoutTime: new Date() });
            user.activeSession = undefined; // Unlink
            await user.save();
        }

        console.log(`[APP-AUTH] Logout successful for ${email}`);
        res.json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        console.error('[APP-AUTH] Logout error:', error);
        res.status(500).json({ success: false, message: 'Server Error during logout' });
    }
};

module.exports = { login, logout, loginWithToken };
