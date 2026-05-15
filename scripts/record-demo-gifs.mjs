import { createRequire } from 'module';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';

const require = createRequire(import.meta.url);
const {
  chromium,
} = require('D:/VietNam_Travel/node_modules/.pnpm/playwright-core@1.60.0/node_modules/playwright-core');

const FFMPEG =
  'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe';

const OUTPUT_DIR = resolve('assets/images');
const VIDEO_DIR = resolve('assets/videos-tmp');

if (!existsSync(VIDEO_DIR)) mkdirSync(VIDEO_DIR, { recursive: true });

async function recordScene(name, fn) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  try {
    await fn(page);
  } catch (e) {
    console.error(`Error in scene "${name}":`, e.message);
  }

  await page.close();
  await context.close();

  const videoPath = await findLatestVideo();
  if (!videoPath) {
    console.error(`No video found for scene "${name}"`);
    return;
  }

  const gifPath = join(OUTPUT_DIR, `demo-${name}.gif`);
  convertToGif(videoPath, gifPath);
  unlinkSync(videoPath);
  console.log(`Created: ${gifPath}`);
}

function findLatestVideo() {
  const files = readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => join(VIDEO_DIR, f));
  if (files.length === 0) return null;
  return files.sort((a, b) => {
    const { mtimeMs: ma } = require('fs').statSync(a);
    const { mtimeMs: mb } = require('fs').statSync(b);
    return mb - ma;
  })[0];
}

function convertToGif(videoPath, gifPath) {
  const palettePath = videoPath.replace('.webm', '-palette.png');
  execSync(
    `"${FFMPEG}" -y -i "${videoPath}" -vf "fps=12,scale=960:-1:flags=lanczos,palettegen=stats_mode=diff" "${palettePath}"`,
    { stdio: 'pipe' },
  );
  execSync(
    `"${FFMPEG}" -y -i "${videoPath}" -i "${palettePath}" -lavfi "fps=12,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" "${gifPath}"`,
    { stdio: 'pipe' },
  );
  if (existsSync(palettePath)) unlinkSync(palettePath);
}

const browser = await chromium.launch({ headless: true });

// Scene 1: Homepage scroll — hero, features, popular tours
await recordScene('homepage', async (page) => {
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1000);
});

// Scene 2: Explore page — search and filter
await recordScene('explore', async (page) => {
  await page.goto('http://localhost:3001/explore', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const searchInput = page
    .locator(
      'input[type="text"], input[type="search"], input[placeholder*="search" i], input[placeholder*="tìm" i]',
    )
    .first();
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.click();
    await page.waitForTimeout(500);
    await searchInput.type('Hà Nội', { delay: 120 });
    await page.waitForTimeout(1500);
  }

  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
});

// Scene 3: AI Planner — chat interaction
await recordScene('ai-planner', async (page) => {
  await page.goto('http://localhost:3001/ai-planner', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const chatInput = page.locator('textarea, input[type="text"]').last();
  if (await chatInput.isVisible().catch(() => false)) {
    await chatInput.click();
    await page.waitForTimeout(400);
    await chatInput.type('Tôi muốn đi du lịch Đà Nẵng 3 ngày, ngân sách 5 triệu', { delay: 80 });
    await page.waitForTimeout(800);

    const sendBtn = page.locator('button[type="submit"], button:has(svg)').last();
    if (await sendBtn.isVisible().catch(() => false)) {
      await sendBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(4000);
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    );
    await page.waitForTimeout(1500);
  } else {
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
    await page.waitForTimeout(2000);
  }
});

await browser.close();

// Cleanup temp video dir
const remaining = readdirSync(VIDEO_DIR);
if (remaining.length === 0) {
  require('fs').rmdirSync(VIDEO_DIR);
}

console.log('\nDone! GIFs saved to assets/images/');
