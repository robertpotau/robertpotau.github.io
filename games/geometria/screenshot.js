const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Screenshot 1: Initial screen
  await page.goto('file:///C:/Users/Robert/Documents/claude-projects/joc-geometria/index.html');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshot-1-splash.png', fullPage: true });

  // Screenshot 2: After clicking to start
  await page.click('button:has-text("Começar")').catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot-2-menu.png', fullPage: true });

  await browser.close();
})();
