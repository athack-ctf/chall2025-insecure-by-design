const express = require('express');
const path = require('path');
const app = express();
const twig = require('twig');
const {getAllReverseSortedQuotes} = require("./datastore-utils");

// Register Twig as the rendering engine for .twig files
app.engine('twig', twig.__express);

// Set up Express to use Twig as the template engine
app.set('view engine', 'twig');
// Set the directory for template files
app.set('views', path.join(__dirname, 'templates'));

// Port 2025
const port = 2024;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Get url encoded data
app.use(express.urlencoded({extended: true}));

// Index
app.get('/', (req, res) => {
    const allQuotes = getAllReverseSortedQuotes();
    const data = {
        quotes: allQuotes
    };
    res.render('index.html.twig', data);
});

// TODO - Login
// TODO - CSS Observable login credentials
// TODO - Logout
// TODO - Customize profile (CSS Injection)
// TODO - Fetch customized styles
// TODO - Adding a new card
// TODO - Admin bot
// TODO - Adding a head to the card

// 404 Not Found handler for all routes that don't match
app.use((req, res) => {
    res.render('404.html.twig');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});