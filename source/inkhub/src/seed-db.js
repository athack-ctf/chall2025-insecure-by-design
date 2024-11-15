const {sequelize, User, Quote, checkIfDbFileExists} = require('./models');
const users = require('../data-seed/seed-users.json');
const quotes = require('./../data-seed/seed-quotes.json');

const {isInspiringQuote, textToHexColor, sha256, generateNumberInRange} = require("./utils");

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
                userHash: sha256(u.username),
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
