import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const apiDir = path.join(root, 'src/content/docs/api');
const distDir = path.join(root, 'dist');

if (fs.existsSync(apiDir)) {
  fs.rmSync(apiDir, { recursive: true, force: true });
  console.log('[Clean] Removed src/content/docs/api');
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('[Clean] Removed dist directory');
}
