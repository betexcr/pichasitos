/**
 * Reads js/sprites.js and writes sprite-assets/characters/* and animations/.
 * Run from repo root: node sprite-assets/tools/export-sprites.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const SPRITES_JS = path.join(REPO_ROOT, 'js', 'sprites.js');
const OUT_ROOT = path.join(REPO_ROOT, 'sprite-assets');

function slug(key) {
  return key.toLowerCase();
}

function writePart(dir, name, data) {
  if (data == null) return;
  const p = path.join(dir, name);
  if (Array.isArray(data)) {
    fs.writeFileSync(p, data.join('\n') + '\n', 'utf8');
  } else if (typeof data === 'object') {
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}

function exportCharacter(baseDir, id, sprite) {
  const dir = path.join(baseDir, slug(id));
  fs.mkdirSync(dir, { recursive: true });
  const { palette, head, torso, body, fist } = sprite;
  writePart(dir, 'palette.json', palette);
  writePart(dir, 'head.txt', head);
  if (torso) writePart(dir, 'torso.txt', torso);
  if (body) writePart(dir, 'body.txt', body);
  if (fist) writePart(dir, 'fist.txt', fist);
  fs.writeFileSync(
    path.join(dir, 'meta.json'),
    JSON.stringify(
      {
        id,
        slug: slug(id),
        parts: {
          head: !!head,
          torso: !!torso,
          body: !!body,
          fist: !!fist,
        },
        note: 'ASCII grids: one character = one palette key. Dot (.) is empty.',
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
}

const full = fs.readFileSync(SPRITES_JS, 'utf8');
const preClass = full.split('class SpriteSystem')[0];
const animMatch = full.match(/static ANIM = (\{[\s\S]*?\n  \})\s*;/);
if (!animMatch) {
  console.error('Could not find SpriteSystem.ANIM in sprites.js');
  process.exit(1);
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(preClass.replace(/^const /gm, 'var '), sandbox);

const { SPRITE_DATA, BULL_SPRITE, PLAYER_SPRITE } = sandbox;
if (!SPRITE_DATA || !PLAYER_SPRITE) {
  console.error('Failed to eval sprite constants');
  process.exit(1);
}

const charsDir = path.join(OUT_ROOT, 'characters');
const animDir = path.join(OUT_ROOT, 'animations');
fs.mkdirSync(charsDir, { recursive: true });
fs.mkdirSync(animDir, { recursive: true });

exportCharacter(charsDir, 'PLAYER', PLAYER_SPRITE);
exportCharacter(charsDir, 'BULL', BULL_SPRITE);

for (const key of Object.keys(SPRITE_DATA)) {
  exportCharacter(charsDir, key, SPRITE_DATA[key]);
}

const animSandbox = {};
vm.createContext(animSandbox);
vm.runInContext('var ANIM = ' + animMatch[1] + ';', animSandbox);
const ANIM = animSandbox.ANIM;

const animOut = {};
for (const [name, frames] of Object.entries(ANIM)) {
  animOut[name] = frames.map((tuple, i) => {
    const [hx, hy, tx, ty, lax, lay, rax, ray, lfist, rfist] = tuple;
    return {
      frameIndex: i,
      headOffset: { x: hx, y: hy },
      torsoOffset: { x: tx, y: ty },
      leftArmOffset: { x: lax, y: lay },
      rightArmOffset: { x: rax, y: ray },
      leftFistExtension: lfist,
      rightFistExtension: rfist,
    };
  });
}

fs.writeFileSync(path.join(animDir, 'action-frames.json'), JSON.stringify(animOut, null, 2) + '\n', 'utf8');

const index = {
  generated: new Date().toISOString(),
  sourceFile: 'js/sprites.js',
  characters: fs
    .readdirSync(charsDir)
    .filter((d) => fs.statSync(path.join(charsDir, d)).isDirectory())
    .sort(),
  animationNames: Object.keys(animOut).sort(),
};

fs.writeFileSync(path.join(OUT_ROOT, 'index.json'), JSON.stringify(index, null, 2) + '\n', 'utf8');

console.log(`Wrote ${index.characters.length} characters and ${index.animationNames.length} animations → ${OUT_ROOT}`);
