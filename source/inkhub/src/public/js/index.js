const clapTracking = {};

async function increaseClapCount(quoteId) {

    const trackingInterval = 2000;

    const clapCountEl = document.getElementById(`clap-count-${quoteId}`);
    const clapIconEl = document.getElementById(`clap-icon-${quoteId}`);

    // Initialize tracking for the specific quoteId if it doesn't exist
    if (!clapTracking[quoteId]) {
        clapTracking[quoteId] = {
            clickCount: 0,
            timeout: null
        };
    }

    // Increment the visible clap count on the page
    let count = parseInt(clapCountEl.innerText, 10);
    clapCountEl.innerText = ++count;

    // Add click animation
    const animationClass = "fa-shake";
    clapIconEl.classList.add(animationClass);
    setTimeout(() => {
        clapIconEl.classList.remove(animationClass);
    }, 200);

    // Update the clap count for this quoteId
    clapTracking[quoteId].clickCount++;

    // If there's no active timeout, start a 2-second countdown
    if (!clapTracking[quoteId].timeout) {
        clapTracking[quoteId].timeout = setTimeout(async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const clickCount = clapTracking[quoteId].clickCount;

                const response = await fetch(`/ajax/submit-claps/${quoteId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({clapCount: clickCount})
                });

                if (response.ok) {
                    // Set the current value of claps
                    clapIconEl.innerText = response.json().data.clapCount;
                }else{
                    throw new Error(`Could not submit claps: ${response.status}`);
                }


            } catch (error) {
                // Handle any errors (network issues, invalid JSON, etc.)
                console.error('Error occurred while submitting claps:', error);
            }


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
    const newQuote = document.getElementById("new-quote-text");
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

    // Making inspiring quotes look different
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

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('input', function() {
            input.setAttribute('value', input.value);
        });
    });

    // Initialize bootstrap models
    const hash = window.location.hash.replace('#', '');
    if (['login', 'logout', 'share-quote'].includes(hash)) {
        try {
            (new bootstrap.Modal(document.getElementById(`${hash}-modal`))).show();
        } catch (e) {
            // no-op
        }
    }

    // Prompting the user to refresh the page (after 2 minutes seconds)
    setTimeout(function () {
        const icon = document.getElementById("refresh-button-icon");
        if (icon) {
            icon.classList.add("fa-beat");
        }
    }, 120000);
});