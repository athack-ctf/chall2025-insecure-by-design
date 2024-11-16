const {sequelize, User, Quote, checkIfDbFileExists} = require('./models');
const users = require('../data-seed/seed-users.json');
const quotes = require('./../data-seed/seed-quotes.json');
const {isInspiringQuote} = require("./validators");
const crypto = require("crypto");

// ---------------------------------------------------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------------------------------------------------
function sha256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

function textToHexColor(text) {
    const hash = md5(text);
    return `#${hash.slice(0, 6)}`;
}


async function generateNumberInRange(input, min, max) {
    // Convert the string to a hash using the SHA-256 algorithm
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash buffer to an integer (we'll use the first 4 bytes for simplicity)
    const hashArray = new Uint8Array(hashBuffer);
    let hash = 0;
    for (let i = 0; i < 4; i++) {
        hash = (hash << 8) | hashArray[i];
    }

    // Map the hash to the desired range [min, max]
    const range = max - min + 1;
    return min + Math.abs(hash % range);
}

// ---------------------------------------------------------------------------------------------------------------------
// Seeding database
// ---------------------------------------------------------------------------------------------------------------------

(async function () {

    if (await checkIfDbFileExists()) {
        console.log("Skipping because database has already been created.")
        return;
    }

    try {
        // Sync the database
        await sequelize.sync();

        const dbUsers = new Array(5).fill(null);
        for (const [index, u] of users.entries()) {
            // Create a user
            const user = await User.create({
                username: u.username,
                userHash: sha256(`${u.username}-@HACK2025`),
                isAdmin: u.username === "admin",
                password: u.password,
            });

            dbUsers[index] = user;
        }

        for (const q of quotes) {
            // Grabbing a random user (deterministically)
            const userIdx = await generateNumberInRange(q.quoteText, 0, dbUsers.length - 1);
            const user = dbUsers[userIdx];

            // Create a quote associated with the user
            await Quote.create({
                quoteText: q.quoteText,
                isInspiring: isInspiringQuote(q.quoteText),
                quoteColor: isInspiringQuote(q.quoteText) ? textToHexColor(q.quoteText) : "#000000",
                clapCount: q.clapCount,
                userId: user.userId
            });
        }

        // Fetch and display quotes with user details
        const usersFetched = await User.findAll();
        const quotesFetched = await Quote.findAll({include: User});
        console.log(`Total users added to the database: ${usersFetched.length}`);
        console.log(`Total quotes added to the database: ${quotesFetched.length}`);

    } catch (error) {
        console.error('Unable to perform database operations:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
})()
