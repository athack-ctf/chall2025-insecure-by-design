const puppeteer = require('puppeteer');

// Utility function to log with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

(async () => {
    logWithTimestamp('Starting the Puppeteer bot...');

    // Launch a new browser instance
    const browser = await puppeteer.launch({
        headless: false, // Set to true if you don't want to see the browser UI
        executablePath: '/usr/bin/google-chrome',
        args: ['--disable-web-security', '--no-sandbox','--incognito'],
    });

    try {
        // Create a new incognito browser context
        logWithTimestamp('Creating an incognito browser context...');

        // Open a new page in the incognito context
        const page = await browser.newPage();

        // Navigate to localhost:2025
        logWithTimestamp('Navigating to http://localhost:2025 in incognito mode...');
        await page.goto('http://localhost:2025', {waitUntil: 'networkidle2'});

        logWithTimestamp('Successfully opened http://localhost:2025 in incognito mode');

        // Add any additional actions or interactions here, if needed

    } catch (err) {
        logWithTimestamp(`An error occurred: ${err.message}`);
    } finally {
        // Close the browser
        logWithTimestamp('Closing the browser...');
        await browser.close();
        logWithTimestamp('Puppeteer bot execution completed.');
    }
})();
