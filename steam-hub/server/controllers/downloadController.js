const supabase = require('../config/supabase');
const User = require('../models/User');

const downloadApp = async (req, res) => {
    try {
        // 1. Verify Authentication
        // The middleware should have already attached req.user if verified, 
        // but if we need a custom check or if middleware isn't present:

        // Assuming authMiddleware is used on the route, req.user will be available.
        // If not using standard middleware (based on user request to "use this for the token"),
        // we might need to check headers manually if not standard.
        // However, I see verifyToken and such in other controllers, so I'll stick to standard patterns 
        // and assume the route is protected.

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Generate Signed URL
        // Bucket: 'downloads' (User provided)
        // File: 'SteamHub.exe' (User provided)

        const { data, error } = await supabase
            .storage
            .from('downloads')
            .createSignedUrl('SteamHub.exe', 60); // Valid for 60 seconds

        if (error) {
            console.error('Supabase Storage Error:', error);
            return res.status(500).json({ success: false, message: 'Could not generate download link' });
        }

        // 3. Return the URL
        res.json({
            success: true,
            downloadUrl: data.signedUrl
        });

    } catch (error) {
        console.error('Download Controller Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { downloadApp };
