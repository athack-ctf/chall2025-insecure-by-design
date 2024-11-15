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

function isInspiringQuote(quote) {
    const wordList = quote.trim().split(/\s+/);
    const startsWithCapital = /^[A-Z]/.test(quote);
    const endsWithPeriod = quote.trim().endsWith('.');
    return (
        // More than 10 words
        wordList.length > 10 &&
        // Starts with a capital letter
        startsWithCapital &&
        // Ends with a period
        endsWithPeriod
    );
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

function isStrictlyPositive(value) {
    return typeof value === 'number' && value > 0;
}

module.exports = {sha256, md5, textToHexColor, isInspiringQuote, generateNumberInRange, isStrictlyPositive};