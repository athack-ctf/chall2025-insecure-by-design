const clapTracking = {};

function increaseClapCount(quoteId) {

    const trackingInterval = 2000;

    const clapCount = document.getElementById(`clap-count-${quoteId}`);
    const clapIcon = document.getElementById(`clap-icon-${quoteId}`);

    // Initialize tracking for the specific quoteId if it doesn't exist
    if (!clapTracking[quoteId]) {
        clapTracking[quoteId] = {
            clickCount: 0,
            timeout: null
        };
    }

    // Increment the visible clap count on the page
    let count = parseInt(clapCount.innerText, 10);
    clapCount.innerText = ++count;

    // Add click animation
    const animationClass = "fa-shake";
    clapIcon.classList.add(animationClass);
    setTimeout(() => {
        clapIcon.classList.remove(animationClass);
    }, 200);

    // Update the clap count for this quoteId
    clapTracking[quoteId].clickCount++;

    // If there's no active timeout, start a 2-second countdown
    if (!clapTracking[quoteId].timeout) {
        clapTracking[quoteId].timeout = setTimeout(() => {
            console.log(`Total clicks for quote ${quoteId} during interval: ${clapTracking[quoteId].clickCount}`);

            // TODO: commit to the backed

            // Reset tracking data for this quoteId
            clapTracking[quoteId].clickCount = 0;
            clapTracking[quoteId].timeout = null;
        }, trackingInterval);
    }
}


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

function newHexColor() {
    return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

function onQuoteTextChanged() {
    // Grabbing quote
    const newQuote = document.getElementById("new-quote");
    const newQuoteStyle = document.getElementById("new-quote-color");
    const quote = newQuote.value;

    // Only allowing alphanumeric characters (and basic punctuation)
    const errorMessage = document.getElementById("new-quote-error");
    const shareButton = document.getElementById("share-new-quote-btn")

    // Check if the input matches the pattern
    if (isValidQuote(quote)) {
        // Hide error message if the input is valid
        errorMessage.style.display = 'none';
        shareButton.disabled = false;
    } else {
        // Show error message
        errorMessage.style.display = 'block';
        shareButton.disabled = true;
    }

    // Making inspiring quotes stylish
    if (isInspiringQuote(quote)) {
        if (!newQuote.closest("form").querySelector('input[name="new-quote-color"]')) {
            const color = newHexColor();
            const newQuoteColor = document.createElement("input");
            newQuoteColor.type = "hidden";
            newQuoteColor.name = "new-quote-color";
            newQuoteColor.value = color;
            newQuote.closest("form").appendChild(newQuoteColor);
            newQuote.style.border = `2px solid ${color}`;
        }
    } else {
        document.querySelector('form input[name="new-quote-color"]')?.remove();
        newQuote.style.border = "2px solid black";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const hash = window.location.hash.replace('#', '');
    if (['login', 'logout', 'share-quote'].includes(hash)) {
        try {
            (new bootstrap.Modal(document.getElementById(`${hash}-modal`))).show();
        } catch (e) {
            // no-op
        }
    }
});