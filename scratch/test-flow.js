const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

(async () => {
    console.log('🚀 Starting NAVITO End-to-End Test with Puppeteer...');
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // Step 1: Open Login Page
        console.log('🔗 Navigating to login page...');
        await page.goto('http://127.0.0.1:5502/public/login.html', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotDir, '01_login_page.png') });
        console.log('📸 Saved: 01_login_page.png');

        // Step 2: Log in as Admin
        console.log('🔑 Logging in as Admin...');
        await page.type('#login-email', 'admin@gmail.com');
        await page.type('#login-password', '0000');
        await page.screenshot({ path: path.join(screenshotDir, '02_credentials_filled.png') });
        console.log('📸 Saved: 02_credentials_filled.png');

        await Promise.all([
            page.click('.auth-btn'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
        await page.screenshot({ path: path.join(screenshotDir, '03_admin_dashboard.png') });
        console.log('📸 Saved: 03_admin_dashboard.png');

        // Step 3: Click on Test Sound button
        console.log('🔔 Clicking Test Notification Sound button...');
        await page.click('#test-notification-sound-btn');
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000))); // Wait for Toast to animate
        await page.screenshot({ path: path.join(screenshotDir, '04_test_sound_triggered.png') });
        console.log('📸 Saved: 04_test_sound_triggered.png');

        // Step 4: Navigate to Storefront Homepage
        console.log('🏪 Navigating to Homepage...');
        await page.goto('http://127.0.0.1:5502/public/index.html', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotDir, '05_homepage.png') });
        console.log('📸 Saved: 05_homepage.png');

        // Step 5: Add a product to the cart
        console.log('🛍️ Adding first product to cart...');
        // Find and click the add-to-cart button
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a'));
            const addBtn = btns.find(b => b.textContent.includes('السلة') || b.textContent.includes('أضف') || b.textContent.includes('Add to Cart'));
            if (addBtn) {
                addBtn.click();
            } else {
                console.log('Add to cart button not found!');
            }
        });
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500))); // Wait for cart update
        await page.screenshot({ path: path.join(screenshotDir, '06_product_added.png') });
        console.log('📸 Saved: 06_product_added.png');

        // Step 6: Go to checkout page
        console.log('💳 Navigating to Checkout Page...');
        await page.goto('http://127.0.0.1:5502/public/checkout.html', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(screenshotDir, '07_checkout_page.png') });
        console.log('📸 Saved: 07_checkout_page.png');

        // Step 7: Fill out the Shipping Form
        console.log('📝 Filling out shipping form...');
        await page.type('#name', 'John Doe');
        await page.type('#email', 'john.doe@example.com');
        await page.type('#phone', '0600000000');
        await page.type('#address', '123 Main Street');
        await page.type('#city', 'Casablanca');
        await page.type('#postal', '20000');
        await page.screenshot({ path: path.join(screenshotDir, '08_shipping_form_filled.png') });
        console.log('📸 Saved: 08_shipping_form_filled.png');

        // Step 8: Confirm Order
        console.log('🚀 Submitting checkout form...');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500))); // Wait for confirmation and redirect
        await page.screenshot({ path: path.join(screenshotDir, '09_order_confirmed.png') });
        console.log('📸 Saved: 09_order_confirmed.png');

        // Step 9: Go to Admin Dashboard to verify order
        console.log('📊 Navigating back to Admin Dashboard...');
        await page.goto('http://127.0.0.1:5502/public/admin.html', { waitUntil: 'networkidle2' });
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000))); // Wait for orders fetch and charts to render
        await page.screenshot({ path: path.join(screenshotDir, '10_admin_dashboard_orders.png') });
        console.log('📸 Saved: 10_admin_dashboard_orders.png');

        // Step 10: Go to Sales page
        console.log('💰 Navigating to Sales Page...');
        await page.goto('http://127.0.0.1:5502/public/sales.html', { waitUntil: 'networkidle2' });
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000))); // Wait for order fetch and render
        await page.screenshot({ path: path.join(screenshotDir, '11_sales_dashboard.png') });
        console.log('📸 Saved: 11_sales_dashboard.png');

        console.log('✅ End-to-End Test completed successfully!');
    } catch (e) {
        console.error('❌ Error during E2E test:', e);
    } finally {
        await browser.close();
    }
})();
