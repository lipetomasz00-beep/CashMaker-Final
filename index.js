// Your existing index.js code with proper error handling

(async () => {
    let browser;
    try {
        // Launch the browser
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://example.com');
        // ... other page interactions
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Ensure the browser is closed
        if (browser) {
            await browser.close();
        }
    }
})();