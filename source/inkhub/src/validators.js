function isValidQuote(quote) {
    if (quote == null || typeof quote !== 'string') {
        return false;
    }
    if (quote.length > 200) {
        return false;
    }
    const quotePattern = /^[\-a-zA-Z0-9., ']*$/;
    return quotePattern.test(quote);
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


function isStrictlyPositive(value) {
    return typeof value === 'number' && value > 0;
}


module.exports = {
    isValidQuote,
    isInspiringQuote,
    isStrictlyPositive,
};