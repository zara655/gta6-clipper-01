// gta6-clipper-01 entry program (Node 22, standard library only).
// The entry is the YouTube video named in VIDEO.json; this program's only
// job is to hand that file to the gate by copying it to the output dir.
// MAKEFUN_BOT_DIR / MAKEFUN_OUTPUT_DIR stand in for /bot and /output when
// running outside the grader's container.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'VIDEO.json');
let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed.url !== 'string' || !/youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\//.test(parsed.url)) {
  console.error('VIDEO.json does not name a YouTube video address');
  process.exit(1);
}
// Hand over the bare address: share-sheet tracking params (?si=...) are
// dropped so the gate always reads the canonical video URL.
const clean = parsed.url.split(/[?#]/)[0];
if (clean !== parsed.url) {
  console.log(`tracking params dropped: ${parsed.url} -> ${clean}`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'VIDEO.json'));
console.log(`VIDEO.json handed over: ${parsed.url}`);
