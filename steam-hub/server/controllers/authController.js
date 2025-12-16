const User = require('../models/User');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../config/brevo');
const { OAuth2Client } = require('google-auth-library');

// Start Google Client (Client ID should be in env, but for now we won't verify strictly if not provided)
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Signup User (Website)
// @route   POST /api/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');

        user = await User.create({
            name,
            email,
            password, // In prod, hash this!
            verificationToken,
            isVerified: false
        });

        // Send Email
        const emailSent = await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            success: true,
            message: emailSent ? 'Signup successful. Please verify your email.' : 'Signup successful, but email failed to send.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify Email (Website)
// @route   GET /api/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send("<h1>Email Verified Successfully! You can now login to the app.</h1>");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// @desc    Google OAuth (Website)
// @route   POST /api/google
// @access  Public
const googleAuth = async (req, res) => {
    const { idToken } = req.body; // Expecting ID Token from frontend
    // Verify token here using google-auth-library if CLIENT_ID was available

    // logic placeholder
    res.json({ success: true, message: "Google Auth Logic Placeholder" });
};

// @desc    Verify User & Machine (App Login)
// @route   POST /api/verify
// @access  Public
const verify = async (req, res) => {
    const { email, password, machineId } = req.body;

    if (!email || !password || !machineId) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    try {
        console.log(`[AUTH] Verifying: ${email} for machine ${machineId}`);
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log(`[AUTH] User not found: ${normalizedEmail}`);
            return res.status(401).json({ success: false, message: 'Invalid Credentials (User)' });
        }

        // Check Password
        // Check Password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            // Basic Check. Should Hash.
            console.log(`[AUTH] Password mismatch for: ${normalizedEmail}`);
            return res.status(401).json({ success: false, message: 'Invalid Credentials (Pass)' });
        }

        // NEW: Check Verification Status
        if (!user.isVerified) {
            console.log(`[AUTH] User ${normalizedEmail} is not verified.`);
            return res.status(403).json({ success: false, message: 'Email not verified. Please check your inbox.' });
        }

        // Logic: Single Machine Lock & Start Time Persistence

        // 1. Check if locked to another machine
        if (user.currentMachineId && user.currentMachineId !== machineId) {
            return res.status(403).json({ success: false, message: `Account locked to another machine.` });
        }

        // 2. If new machine (or released), lock it
        if (!user.currentMachineId) {
            user.currentMachineId = machineId;
            if (!user.firstInstallTime) {
                user.firstInstallTime = new Date();
            }
            await user.save();
            console.log(`[AUTH] User ${email} locked to ${machineId}.`);
        } else {
            console.log(`[AUTH] User ${email} verified on existing machine ${machineId}.`);
        }

        // 3. Calculate Expiration
        let endDate = null;
        if (user.licenseType === 'rent' && user.limitMinutes > 0 && user.firstInstallTime) {
            const startTime = new Date(user.firstInstallTime);
            endDate = new Date(startTime.getTime() + user.limitMinutes * 60000).toISOString();
        }

        res.json({
            success: true,
            message: 'Verified',
            config: {
                type: user.licenseType,
                limit: user.limitMinutes,
                endDate: endDate,
                payloadUrl: `/payloads/${user._id}_payload.zip`
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Release Machine
// @route   POST /api/release
// @access  Public
const release = async (req, res) => {
    const { machineId, password } = req.body;

    try {
        const user = await User.findOne({ currentMachineId: machineId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found for this machine.' });
        }

        if (password && user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        user.currentMachineId = null;
        await user.save();
        console.log(`[AUTH] Machine ${machineId} released from user ${user.email}`);

        res.json({ success: true, message: 'Machine Released' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { signup, verifyEmail, googleAuth, verify, release };
