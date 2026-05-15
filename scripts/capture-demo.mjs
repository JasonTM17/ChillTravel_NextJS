import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {
  chromium,
} = require('D:/VietNam_Travel/node_modules/.pnpm/playwright-core@1.60.0/node_modules/playwright-core');

const pages = [
  ['http://localhost:3001', 'assets/images/demo-homepage.png'],
  ['http://localhost:3001/explore', 'assets/images/demo-explore.png'],
  ['http://localhost:3001/ai-planner', 'assets/images/demo-ai-planner.png'],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

for (const [url, path] of pages) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path, fullPage: false });
  console.log('Captured:', path);
}

await browser.close();
console.log('Done!');
