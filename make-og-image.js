const puppeteer = require('./promo/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  const file = 'file://' + path.resolve(__dirname, 'og-image.html');
  await page.goto(file, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.resolve(__dirname, 'og-image.png'), type: 'png' });
  await browser.close();
  console.log('og-image.png erstellt!');
})();
