import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(path.resolve(__dirname, '..', 'e2e', 'package.json'));
const { chromium } = require('@playwright/test');

const outputDir = path.resolve(__dirname, '..', 'assets', 'images');

const BASE = 'http://localhost:3001';

const pages = [
  { name: 'tour-detail', url: '/tours/central-vietnam-heritage-tour', width: 1440, height: 900 },
  { name: 'explore-search', url: '/explore', width: 1440, height: 900 },
  { name: 'hotel-detail', url: '/hotels/1', width: 1440, height: 900 },
  { name: 'ai-planner', url: '/ai-planner', width: 1440, height: 900 },
  { name: 'admin-dashboard', url: '/admin', width: 1440, height: 900 },
  {
    name: 'booking-flow',
    url: '/booking/new?tourId=central-vietnam-heritage-tour&guests=2',
    width: 1440,
    height: 900,
  },
];

async function main() {
  const browser = await chromium.launch({ headless: true });

  for (const page of pages) {
    console.log(`Capturing ${page.name}...`);
    const context = await browser.newContext({
      viewport: { width: page.width, height: page.height },
      deviceScaleFactor: 2,
    });
    const tab = await context.newPage();

    try {
      await tab.goto(`${BASE}${page.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      await tab.waitForTimeout(2000);
      await tab.screenshot({
        path: path.join(outputDir, `${page.name}.png`),
        fullPage: false,
      });
      console.log(`  -> saved ${page.name}.png`);
    } catch (err) {
      console.error(`  -> FAILED ${page.name}: ${err.message}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('Done!');
}

main();
