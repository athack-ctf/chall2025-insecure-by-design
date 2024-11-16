const puppeteer = require('puppeteer');
const admin = require("./admin.json");

// Configs

const USERNAME = admin.username;
const PASSWORD = admin.password;
const BASE_URL = "http://localhost:2025/"
const TYPING_DELAY = 250;

// Utility function to log with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

    logWithTimestamp('Starting the Puppeteer bot...');

    try {
        // Launch the browser
        const browser = await puppeteer.launch({
            headless: false, // TODO: Set to true if you don't want to see the browser UI
            defaultViewport: null, // Use full screen
            args: ['--start-maximized', '--incognito'], // Start maximized and in incognito mode
        });

        // Open a new page
        const page = await browser.newPage();

        // Navigate to localhost:2025
        logWithTimestamp(`Navigating to ${BASE_URL}#login in private mode...`);
        await page.goto(`${BASE_URL}#login`, { waitUntil: 'networkidle2' });

        logWithTimestamp('Filling in the username and password...');

        // Type the username
        await page.type('#username', USERNAME, { delay: TYPING_DELAY }); // Delay makes typing look more natural
        logWithTimestamp('Username typed.');

        // Type the password
        await page.type('#password', PASSWORD, { delay: TYPING_DELAY });
        logWithTimestamp('Password typed.');

        // Click the button with the text "Let me in!"
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

        // Optional: Wait for navigation or some response
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        logWithTimestamp('Navigation after login completed.');


        logWithTimestamp('Searching for buttons with the class "clap-btn"...');

        // Get all buttons with the class "clap-btn"
        const buttons = await page.$$eval('.clap-btn', nodes => nodes.map((node, index) => ({ index, node: node.outerHTML })));

        if (buttons.length === 0) {
            logWithTimestamp('No buttons with class "clap-btn" found on the page.');
            return;
        }

        logWithTimestamp(`Found ${buttons.length} buttons with class "clap-btn".`);

        // Shuffle the buttons and pick 3 unique ones
        const shuffledButtons = buttons.sort(() => Math.random() - 0.5);
        const selectedButtons = shuffledButtons.slice(0, 3);

        for (const { index } of selectedButtons) {
            const clickCount = Math.floor(Math.random() * 50) + 10; // Random number between 1 and 20
            logWithTimestamp(`Clicking button ${index + 1} (${clickCount} times)...`);

            for (let i = 0; i < clickCount; i++) {
                await page.evaluate(idx => {
                    document.querySelectorAll('.clap-btn')[idx].click();
                }, index);

                await sleep(100); // Optional: Add a delay between clicks
            }

            logWithTimestamp(`Finished clicking button ${index + 1}.`);
        }

        await sleep(5000);

        // Close the browser
        logWithTimestamp('Closing the browser...');
        await browser.close();
        logWithTimestamp('Puppeteer bot execution completed.');

    } catch (err) {
        logWithTimestamp(`An error occurred: ${err.message}`);
    }
})();
