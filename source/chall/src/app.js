const path = require('path');
const express = require('express');
const session = require('express-session');
const twig = require('twig');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const {getAllReverseSortedQuotes, getAllUsersDict} = require("./datastore-utils");
const {sha256} = require("./utils");

// ---------------------------------------------------------------------------------------------------------------------
// Creating app
// ---------------------------------------------------------------------------------------------------------------------

const app = express();

// ---------------------------------------------------------------------------------------------------------------------
// Twig
// ---------------------------------------------------------------------------------------------------------------------

// Register Twig as the rendering engine for .twig files
app.engine('twig', twig.__express);

// Set up Express to use Twig as the template engine
app.set('view engine', 'twig');

// Set the directory for template files
app.set('views', path.join(__dirname, 'templates'));

// ---------------------------------------------------------------------------------------------------------------------
// Static files
// ---------------------------------------------------------------------------------------------------------------

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------------------------------------------------
// Encoding
// ---------------------------------------------------------------------------------------------------------------------

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));

// Parse URL-encoded bodies (needed for CSRF token generation as well)
app.use(express.urlencoded({extended: true}));

// ---------------------------------------------------------------------------------------------------------------------
// CSRF
// ---------------------------------------------------------------------------------------------------------------------

// Set up cookie parser middleware
app.use(cookieParser());

// Set up CSRF protection middleware
const csrfProtectionMiddleware = csrf({cookie: true});

// Apply CSRF protection to routes that need it
app.use(csrfProtectionMiddleware);

// ---------------------------------------------------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------------------------------------------------

// Session middleware
app.use(session({
    secret: 'at-hack-let5-h@ck-n0-SLACK!!!',
    resave: false,
    saveUninitialized: true,
}));

// ---------------------------------------------------------------------------------------------------------------------
// Auth predicate
// ---------------------------------------------------------------------------------------------------------------------

function isLoggedIn(req) {
    return req.session.isLoggedIn === true;
}

function setIsLoggedIn(req, username) {
    req.session.isLoggedIn = true;
    req.session.username = username;
    return req;
}

// ---------------------------------------------------------------------------------------------------------------------
// Port number
// ---------------------------------------------------------------------------------------------------------------------

// Port 2025
const port = 2025;

// ---------------------------------------------------------------------------------------------------------------------
// Getting all read-only data
// ---------------------------------------------------------------------------------------------------------------------

// Get all users
const usersDict = getAllUsersDict();

// ---------------------------------------------------------------------------------------------------------------------
// Adding routes
// ---------------------------------------------------------------------------------------------------------------------

// Index
app.get('/', (req, res) => {

    const allQuotes = getAllReverseSortedQuotes();

    const data = {
        quotes: allQuotes
    };

    data.csrfToken = req.csrfToken();

    if (isLoggedIn(req)) {
        data.isLoggedIn = true;
        data.user = usersDict[req.session.username];
    } else {
        data.isLoggedIn = false;
        data.user = null;
    }

    res.render('index.html.twig', data);
});

// Login route
app.post('/login', (req, res) => {

    // The user is already authenticated
    if (isLoggedIn(req)) {
        res.redirect('/');
        return;
    }

    // Grabbing credentials
    const {username, password} = req.body;


    // Making sure the credentials are in the right type
    if (username == null || typeof username !== 'string' || password == null || typeof password !== 'string') {
        // Set 400
        res.status(400).render('400.html.twig');
        return;
    }

    // Check if the username exists and hashed passwords match
    if (username && password && usersDict[username] && usersDict[username].password === sha256(password)) {
        // Store username in session
        setIsLoggedIn(req, username);
        res.redirect('/');
        return;
    } else {
        res.status(401).render('401-login-failed.html.twig');
        return;
    }
});

// Logout route
app.post('/logout', csrfProtectionMiddleware, (req, res) => {
    // Cannot logout somehow who is not authenticated
    if (!isLoggedIn(req)) {
        res.redirect('/#login');
        return;
    }
    req.session.destroy((err) => {
        if (err) {
            res.status(500).render('500.html.twig');
            return;
        }
        res.redirect('/#login');
    });
});

// ---------------------------------------------------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------------------------------------------------

// Error handling middleware for CSRF errors
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Handle CSRF token errors here
        res.status(403).render('403-bad-csrf-token.html.twig');

    } else {
        // For other errors, call the next error handler
        next(err);
    }
});

// 404 Not Found handler for all routes that don't match
app.use((req, res) => {
    // Set 404
    res.status(404).render('404.html.twig');
});

// ---------------------------------------------------------------------------------------------------------------------
// Starting the server
// ---------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// ---------------------------------------------------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------------------------------------------------

// TODO - Rate limiting
// TODO - CSS Observable login credentials
// TODO - Customize profile (CSS Injection)
// TODO - Fetch customized styles
// TODO - Adding a new card
// TODO - Admin bot
// TODO- Clapping
// TODO - Weak color validator (has to start with #