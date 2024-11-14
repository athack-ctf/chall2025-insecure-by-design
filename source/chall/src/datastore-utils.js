const {sha256, textToHexColor, isInspiringQuote} = require("./utils");

function getAllReverseSortedQuotes() {
    const quotes = [
        {
            quoteId: 100,
            quoteText: "This is an inspiring quote shared by a user.",
            clapCount: 12,
            user: {
                userId: 100,
                username: "Username",
                userHash: "01d1ebf1868dec4ae48b65016fff9069",
            }
        },
        {
            quoteId: 101,
            quoteText: "The best way to predict the future is to invent it.",
            clapCount: 34,
            user: {
                userId: 101,
                username: "FutureGazer",
                userHash: "a7c5f9d18d4b2d8b6e5c4e1d2a3c7b2d",
            }
        },
        {
            quoteId: 102,
            quoteText: "Believe you can, and you're halfway there.",
            clapCount: 27,
            user: {
                userId: 102,
                username: "Believer",
                userHash: "b3a1d1c8a4f5e2b8f4e7d1c3a9d6f2e1",
            }
        },
        {
            quoteId: 103,
            quoteText: "Do one thing every day that scares you.",
            clapCount: 45,
            user: {
                userId: 103,
                username: "DareDevil",
                userHash: "c2b4d1a5d8e9f7a6b1c3d4e8f9b7a2e1",
            }
        },
        {
            quoteId: 104,
            quoteText: "Your time is limited, don't waste it living someone else's life.",
            clapCount: 59,
            user: {
                userId: 104,
                username: "TimeSaver",
                userHash: "d3f4a1b5c8e2d7f6b9a3c4d1e8f7b6e2",
            }
        },
        {
            quoteId: 105,
            quoteText: "The only way to do great work is to love what you do.",
            clapCount: 38,
            user: {
                userId: 105,
                username: "WorkLover",
                userHash: "e4b3a2d5c7f9e8a6d1b4c3e7f6a9b5e3",
            }
        },
        {
            quoteId: 106,
            quoteText: "The journey of a thousand miles begins with one step.",
            clapCount: 22,
            user: {
                userId: 106,
                username: "PathFinder",
                userHash: "f7a1d3b4c2e9d8f5a6b3c4d1e9f8b7a3",
            }
        },
        {
            quoteId: 107,
            quoteText: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
            clapCount: 31,
            user: {
                userId: 107,
                username: "SoulSeeker",
                userHash: "a1d2b3f9c8e7d6a5f4b9e3c7d8a6f1e4",
            }
        },
        {
            quoteId: 108,
            quoteText: "Happiness is not something ready-made. It comes from your own actions.",
            clapCount: 42,
            user: {
                userId: 108,
                username: "JoyMaker",
                userHash: "b5f4a3d2e7c9b1d8f6a9c4e1d7f3b2e9",
            }
        },
        {
            quoteId: 109,
            quoteText: "Life is 10% what happens to us and 90% how we react to it.",
            clapCount: 50,
            user: {
                userId: 109,
                username: "ReactRight",
                userHash: "c9b1f4a5e3d7f2a6b3c8e9d1a7f6b5e4",
            }
        }
    ];

    quotes.forEach(q => {
        if (isInspiringQuote(q.quoteText)) {
            q.quoteColor = textToHexColor(q.quoteText);
        } else {
            q.quoteColor = "#000000";
        }
    })

    function sortByQuoteId(arr) {
        return arr.sort((a, b) => b.quoteId - a.quoteId);
    }

    return sortByQuoteId(quotes);
}


function getAllUsers() {
    const users = [
        {
            username: "admin",
            password: sha256("admin"),
        },
        {
            username: "jdoe",
            password: sha256("securePa$$word1"),
        },
        {
            username: "asmith",
            password: sha256("anotherP@ssw0rd2"),
        },
        {
            username: "mbrown",
            password: sha256("thirdPa$$3"),
        },
        {
            username: "tjohnson",
            password: sha256("fourthPassw0rd4"),
        },
        {
            username: "lwilson",
            password: sha256("passwordNumb3r5"),
        }
    ];

    let userId = 100;
    users.forEach(u => {
        u.userId = userId;
        u.userHash = sha256(u.username);
        u.isAdmin = u.username === "admin";
        userId++;
    });

    return users;
}

function getAllUsersDict() {
    return getAllUsers().reduce((dict, user) => {
        dict[user.username] = user;
        return dict;
    }, {});
}

module.exports = {getAllReverseSortedQuotes, getAllUsers, getAllUsersDict};