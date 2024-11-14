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

module.exports = {sha256, md5, textToHexColor, isInspiringQuote};