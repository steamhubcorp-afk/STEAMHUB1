const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Game = require('./models/Game');
const { generateUserPayload } = require('./services/payloadService');

dotenv.config();

const EXTERNAL_GAME_DIR = path.resolve(__dirname, '../Game');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DEST_GAMES_DIR = path.join(PUBLIC_DIR, 'games');

// Ensure destination exists
if (!fs.existsSync(DEST_GAMES_DIR)) {
    fs.mkdirSync(DEST_GAMES_DIR, { recursive: true });
}

// Recursive listing helper (filtering extensions)
const getGameFiles = (dirPath, arrayOfFiles) => {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getGameFiles(fullPath, arrayOfFiles);
        } else {
            // Filter: .lua or .manifest
            if (file.endsWith('.lua') || file.endsWith('.manifest')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // --- 1. Process Games ---
        console.log(`Scanning Games in: ${EXTERNAL_GAME_DIR}`);
        if (!fs.existsSync(EXTERNAL_GAME_DIR)) {
            console.error("External Game Directory NOT FOUND!");
            process.exit(1);
        }

        const gameFolders = fs.readdirSync(EXTERNAL_GAME_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`Found ${gameFolders.length} games.`);

        await Game.deleteMany({}); // Clear existing games
        let createdGameIds = [];

        for (const gameName of gameFolders) {
            console.log(`Processing: ${gameName}...`);
            const sourcePath = path.join(EXTERNAL_GAME_DIR, gameName);
            const destGameDir = path.join(DEST_GAMES_DIR, gameName);

            // 1. Find Files (Recursive, Filtered)
            const allowedFiles = getGameFiles(sourcePath);

            if (allowedFiles.length === 0) {
                console.log(`  Skipping ${gameName} (No .lua or .manifest found)`);
                continue;
            }

            // 2. Copy Files & Collect Relative Paths
            if (!fs.existsSync(destGameDir)) fs.mkdirSync(destGameDir, { recursive: true });

            let manifestFiles = [];

            allowedFiles.forEach(srcFile => {
                const fileName = path.basename(srcFile);
                const destFile = path.join(destGameDir, fileName); // Flattening inside games/GameName/ is probably fine?
                // Wait, if we flatten, we might collide if source has subfolders. 
                // But generally game structure is flat for these files.
                // Let's keep it simple: Copy to destGameDir/filename

                fs.copyFileSync(srcFile, destFile);

                // Store relative path from PUBLIC_DIR
                const relPath = path.relative(PUBLIC_DIR, destFile).replace(/\\/g, '/');
                manifestFiles.push(relPath);
            });

            // 3. Create DB Entry
            const game = await Game.create({
                title: gameName,
                steamAppId: 0,
                price: 59.99,
                manifestFiles: manifestFiles
            });
            createdGameIds.push(game._id);
            console.log(`  Saved Game ID: ${game._id} (${manifestFiles.length} files)`);
        }

        // --- 2. Create User ---
        console.log("Seeding User 'yash@steam.com'...");
        await User.deleteMany({ email: 'yash@steam.com' });

        const user = await User.create({
            email: 'yash@steam.com',
            password: 'yash',
            ownedGames: [], // Start with NO games
            licenseType: 'rent',
            limitMinutes: 60,
            currentMachineId: null,
            firstInstallTime: null
        });
        console.log(`User Seeded: ${user.email} (Owned: ${user.ownedGames.length} games)`);

        // --- 3. Payload Generation Skipped (Manual Test) ---
        // console.log('Generating User Payload...');
        // const zipName = await generateUserPayload(user._id);
        // console.log(`Payload Ready: ${zipName}`);

        console.log('Seeding Complete. Payload generation skipped.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
