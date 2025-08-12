import { chromium } from 'playwright';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const root = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto('file://' + join(root, 'storybook-static', 'index.html'));
mkdirSync(join(root, '.snapshots'), { recursive: true });
await page.screenshot({ path: join(root, '.snapshots', 'storybook.png'), fullPage: true });
await browser.close();
