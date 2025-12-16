const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const User = require('../models/User');

const PAYLOAD_DIR = path.join(__dirname, '../public/payloads');
const SOURCE_DIR = path.join(__dirname, '../public'); // Base dir for manifest files

// Ensure payload dir exists
if (!fs.existsSync(PAYLOAD_DIR)) {
    fs.mkdirSync(PAYLOAD_DIR, { recursive: true });
}

const generateUserPayload = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId).populate('ownedGames');
            if (!user) return reject(new Error('User not found'));

            const outputPath = path.join(PAYLOAD_DIR, `${userId}_payload.zip`);
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });

            output.on('close', function () {
                console.log(`[PAYLOAD] Generated for ${user.email}: ${archive.pointer()} total bytes`);
                resolve(`${userId}_payload.zip`); // Return filename
            });

            archive.on('error', function (err) {
                reject(err);
            });

            archive.pipe(output);

            let finalManifestList = [];

            // 1. Add Game Files
            user.ownedGames.forEach(game => {
                if (game.manifestFiles && game.manifestFiles.length > 0) {
                    game.manifestFiles.forEach(fileRelPath => {
                        const fullPath = path.join(SOURCE_DIR, fileRelPath);
                        if (fs.existsSync(fullPath)) {
                            const fileName = path.basename(fullPath);
                            let zipPath = fileName; // Default fallback

                            // Logic: stplug-in vs depotcache
                            if (fileName.endsWith('.lua')) {
                                zipPath = `stplug-in/${fileName}`;
                            } else if (fileName.endsWith('.manifest')) {
                                zipPath = `depotcache/${fileName}`;
                            } else {
                                // Fallback or ignore? 
                                // User said "ignore .txt", which we did in seed.
                                // If some other file slipped in, maybe ignore or put in root.
                                // Let's put in root for safety, or ignore.
                                // The User's explicit rule was "stplug-in = .lua, depotcache = .manifest".
                            }

                            archive.file(fullPath, { name: zipPath });
                            finalManifestList.push(zipPath);
                        } else {
                            console.warn(`[PAYLOAD] Missing file: ${fullPath}`);
                        }
                    });
                }
            });

            // 2. Generate Dynamic manifest.json
            // If the client relies on this list, it needs the ZIP paths.
            const dynamicManifest = JSON.stringify(finalManifestList, null, 2);
            archive.append(dynamicManifest, { name: 'manifest.json' });

            // 3. Secret Payload? (Legacy)
            if (fs.existsSync(path.join(SOURCE_DIR, 'secret_payload.txt'))) {
                archive.file(path.join(SOURCE_DIR, 'secret_payload.txt'), { name: 'secret_payload.txt' });
            }

            archive.finalize();

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateUserPayload };
