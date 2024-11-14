const crypto = require('crypto');

// Helper function to hash passwords
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

module.exports = {sha256, md5, textToHexColor};