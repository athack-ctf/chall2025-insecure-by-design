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

        // Close the browser
        logWithTimestamp('Closing the browser...');
        await browser.close();
        logWithTimestamp('Puppeteer bot execution completed.');

    } catch (err) {
        logWithTimestamp(`An error occurred: ${err.message}`);
    }
})();
