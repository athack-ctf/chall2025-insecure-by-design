const crypto = require('crypto');

// Helper function to hash passwords
function sha256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {sha256};