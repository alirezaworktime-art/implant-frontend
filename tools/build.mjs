// Builds the pages from src/: joins every page's parts (src/**/page.json) in order and writes the page at the repo root.
//   node tools/build.mjs           write index.html, p.html, f.html, probe.html
//   node tools/build.mjs --check   write nothing; exit 1 if a committed page differs from what src/ gives
// Joining is byte-exact: fixed text (tags) + file contents + images (base64), nothing added or trimmed.
import fs from 'node:fs'; import path from 'node:path'; import url from 'node:url'; import crypto from 'node:crypto';
const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..'), SRC = path.join(root, 'src');
const check = process.argv.includes('--check');
const pages = []; const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'page.json') pages.push(p); } };
walk(SRC);
export function buildPage(json) {
  const m = JSON.parse(fs.readFileSync(json, 'utf8'));
  const text = m.parts.map(p => p.raw !== undefined ? p.raw : p.file ? fs.readFileSync(path.join(SRC, p.file), 'utf8') : fs.readFileSync(path.join(SRC, p.image)).toString('base64')).join('');
  return { out: m.out, text };
}
const md5 = t => crypto.createHash('md5').update(t).digest('hex');
let bad = 0;
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  for (const j of pages.sort()) {
    const { out, text } = buildPage(j), f = path.join(root, out), cur = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
    if (check) { const same = cur === text; if (!same) bad++; console.log((same ? 'same    ' : 'DIFFERS ') + out + ' ' + md5(text)); }
    else { if (cur !== text) fs.writeFileSync(f, text); console.log((cur === text ? 'unchanged ' : 'written   ') + out + ' ' + md5(text)); }
  }
  if (check && bad) { console.error(bad + ' page(s) differ from src/: run  node tools/build.mjs  and commit'); process.exit(1); }
}
