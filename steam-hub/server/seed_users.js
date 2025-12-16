const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUser = async () => {
    // Usage: node seed_users.js <email> <password> <limitHours>
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log('Usage: node seed_users.js <email> <password> <limitHours>');
        console.log('Example: node seed_users.js test@steam.com pass123 2');
        process.exit(1);
    }

    const [email, password, limitHours] = args;
    const limitMinutes = parseFloat(limitHours) * 60;

    try {
        await connectDB();
        console.log('MongoDB Connected.');

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} already exists. Updating...`);
            user.name = "Test User"; // Ensure name exists
            user.password = password;
            user.limitMinutes = limitMinutes;
            user.isVerified = true; // Auto-verify seeded users
            await user.save();
            console.log(`User updated: ${email}`);
        } else {
            user = await User.create({
                name: "Test User",
                email,
                password,
                limitMinutes,
                licenseType: 'rent',
                ownedGames: [],
                isVerified: true
            });
            console.log(`User created: ${email}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUser();
