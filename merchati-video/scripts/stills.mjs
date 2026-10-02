// Renders inspection stills: node scripts/stills.mjs <compId> <frame,frame,...> [outDir]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [compId, framesArg, outDir = 'out/stills'] = process.argv.slice(2);
const frames = framesArg.split(',').map(Number);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
fs.mkdirSync(outDir, {recursive: true});
for (const frame of frames) {
  const output = path.join(outDir, `${compId}-${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable});
  console.log('wrote', output);
}
