const {sequelize, User, Quote} = require('./models');
const {isInspiringQuote, textToHexColor, sha256, generateNumberInRange} = require("./utils");

(async function () {

    const users = [
        {
            username: "admin",
            password: "Iat20HA25CKl0v3ctf",
        },
        {
            username: "qubit.wizard",
            password: "EntangleM3!",
        },
        {
            username: "neural.nate",
            password: "DeepDr34ms#",
        },
        {
            username: "alice.algorithms",
            password: "SortThis!42",
        },
        {
            username: "quantum.qarl",
            password: "SpookyActi0n",
        },
        {
            username: "higgs.hacker",
            password: "B0s0n4Life!",
        },
        {
            username: "tensor.terry",
            password: "FlowingT3ns0rs",
        },
        {
            username: "schrodinger.sam",
            password: "InOrOut@Cat",
        },
        {
            username: "fuzzy.frances",
            password: "LogicRul3z!",
        },
        {
            username: "quark.quincy",
            password: "Str4ngeUpDown",
        },
    ];

    const quotes = [
        {
            quoteText: "I like defining undefined behaviours.",
            clapCount: 25,
        },
        {
            quoteText: "I turn bugs into features, and you know what I mean.",
            clapCount: 2025,
        },
        {
            quoteText: "To err is human, to exploit is divine.",
            clapCount: 1994,
        },
        {
            quoteText: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
            clapCount: 20,
        },
        {
            quoteText: "The real question is not whether machines think but whether humans do.",
            clapCount: 14,
        },
        {
            quoteText: "You can’t understand AI. You can only be glad it works.",
            clapCount: 51,
        },
        {
            quoteText: "Any sufficiently advanced technology is indistinguishable from magic.",
            clapCount: 23,
        },
        {
            quoteText: "My code is just like your relationship. It’s complicated.",
            clapCount: 150,
        },
        {
            quoteText: "InkHub sucks, big time...",
            clapCount: 1,
        },
        {
            quoteText: "I should have stayed home today...",
            clapCount: 1,
        },
        {
            quoteText: "Never judge a book by its cover... unless it's a textbook. Then, definitely judge it by the weight.",
            clapCount: 1,
        },
        {
            quoteText: "AT-HACK-CTF IS NOT A HACKATHON, IT'S A FREAKING CTF. CHANGE MY MIND.",
            clapCount: 1,
        },
    ];

    try {
        // Sync the database
        await sequelize.sync();

        const dbUsers = users.map(async u => {
            // Create a user
            const user = await User.create({
                username: u.username,
                userHash: sha256(u.username),
                isAdmin: u.username === "admin",
                password: u.password,
            });
            return user;
        })

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
        const dbQuotes = await Quote.findAll({include: User});
        console.log(JSON.stringify(dbQuotes, null, 2));

    } catch (error) {
        console.error('Unable to perform database operations:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
})()
