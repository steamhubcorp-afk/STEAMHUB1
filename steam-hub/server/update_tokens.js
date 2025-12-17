const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const updateTokens = async () => {
    try {
        await connectDB();

        console.log("Updating users...");

        // requested by user
        const res = await User.updateMany(
            {},
            { $set: { token: "empty" } }
        );

        console.log(`Success! Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
        process.exit();
    } catch (error) {
        console.error("Error updating tokens:", error);
        process.exit(1);
    }
};

updateTokens();
