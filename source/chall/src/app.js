const express = require('express');
const path = require('path');
const app = express();

// Port 2025
const port = 2025;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Get url encoded data
app.use(express.urlencoded({extended: true}));

// Index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'index.html'));
});

// 404 Not Found handler for all routes that don't match
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'private', '404.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});