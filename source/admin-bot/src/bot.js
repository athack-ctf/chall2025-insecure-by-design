const puppeteer = require('puppeteer');
const admin = require("./admin.json");
const quotes = require("./quotes.json");

// Configs
const USERNAME = admin.username;
const PASSWORD = admin.password;
const BASE_URL = "http://localhost:2025/"
const TYPING_DELAY = 250;
const CLAPPING_DELAY = 10;
const NEW_QUOTE = quotes[Math.floor(Math.random() * quotes.length)];

// Utility function to log with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Authenticate the user
async function authenticate(page) {
    logWithTimestamp(`Navigating to ${BASE_URL}#login in private mode...`);
    await page.goto(`${BASE_URL}#login`, {waitUntil: 'networkidle2'});

    await sleep(2000);

    logWithTimestamp('Filling in the username and password...');
    await page.type('#username', USERNAME, {delay: TYPING_DELAY}); // Delay makes typing look more natural
    logWithTimestamp('Username typed.');

    await page.type('#password', PASSWORD, {delay: TYPING_DELAY});
    logWithTimestamp('Password typed.');

    logWithTimestamp('Clicking the "Let me in!" button...');
    await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.trim() === 'Let me in!'
        );
        if (button) {
            button.click();
        }
    });

    logWithTimestamp('Clicked the "Let me in!" button.');

    await page.waitForNavigation({waitUntil: 'networkidle2'});
    logWithTimestamp('Navigation after login completed.');


}

// Click on "clap" buttons with random clicks
async function clapOnQuotes(page) {
    logWithTimestamp('Searching for buttons with the class "clap-btn"...');

    const buttons = await page.$$eval('.clap-btn', nodes => nodes.map((node, index) => ({
        index,
        node: node.outerHTML
    })));

    if (buttons.length === 0) {
        logWithTimestamp('No buttons with class "clap-btn" found on the page.');
        return;
    }

    logWithTimestamp(`Found ${buttons.length} buttons with class "clap-btn".`);

    const shuffledButtons = buttons.sort(() => Math.random() - 0.5);
    const selectedButtons = shuffledButtons.slice(0, 3);

    for (const {index} of selectedButtons) {
        const clickCount = Math.floor(Math.random() * 25) + 10;
        logWithTimestamp(`Clicking button ${index + 1} (${clickCount} times)...`);

        for (let i = 0; i < clickCount; i++) {
            await page.evaluate(idx => {
                document.querySelectorAll('.clap-btn')[idx].click();
            }, index);

            await sleep(CLAPPING_DELAY);
        }

        logWithTimestamp(`Finished clicking button ${index + 1}.`);
    }
}

// Share the quote in a modal
async function shareQuote(page) {

    logWithTimestamp('Clicking to trigger modal...');
    await page.click('#btn-share-quote'); // Click the button to trigger the modal (if needed)

    const textAreaSelector = '#new-quote-text';
    logWithTimestamp('Waiting for the text area to appear...');
    await page.waitForSelector(textAreaSelector, {visible: true});

    // Wait for 1 second
    await sleep(2000);

    logWithTimestamp('Filling the text area with the new quote...');
    await page.type(textAreaSelector, NEW_QUOTE, {delay: TYPING_DELAY});
    logWithTimestamp('Text area filled with the new quote.');

    // Wait for 1 second
    await sleep(500);

    logWithTimestamp('Submitting quote...');
    await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.trim() === 'Share Quote'
        );
        if (button) {
            button.click();
        }
    });

    // Wait for 1 second
    await sleep(2000);
}

(async () => {

    logWithTimestamp('Starting the Puppeteer bot...');

    try {

        // Puppeteer config
        const config = {
            headless: (process.env.USE_HEADLESS_MODE === 'true'),
            args: ['--disable-web-security', '--no-sandbox', '--incognito'],
        };

        if (process.env.CHROME_ABS_PATH) {
            config.executablePath = process.env.CHROME_ABS_PATH;
        }

        // Launch the browser
        const browser = await puppeteer.launch(config);

        // Open a new page
        const page = await browser.newPage();

        logWithTimestamp('Authenticating...');
        await authenticate(page);

        // Wait for 1 second
        await sleep(1000);

        logWithTimestamp('Clapping...');
        await clapOnQuotes(page);
        // Wait for 1 second
        await sleep(1000);

        logWithTimestamp('Sharing a new quote...');
        await shareQuote(page);
        // Wait for 1 second
        await sleep(1000);

        // Close the browser
        logWithTimestamp('Closing the browser...');
        await browser.close();
        logWithTimestamp('Puppeteer bot execution completed.');

    } catch (err) {
        logWithTimestamp(`An error occurred: ${err.message}`);
    }
})();
