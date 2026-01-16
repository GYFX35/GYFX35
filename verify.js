const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console events and print them to the terminal
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('http://localhost:8788/videos', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/home/jules/verification/videos-page-final.png' });
  await browser.close();
})();
