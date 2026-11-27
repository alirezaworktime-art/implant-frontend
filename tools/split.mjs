// One-time: turns the old single-file pages (index.html, p.html, f.html, probe.html) into the src/ tree.
// Every page becomes src/<page>/page.json: an ordered list of parts — fixed text (the tags), source files, or images
// (base64 in the page, binary files in src/). tools/build.mjs joins the parts back into the same bytes.
//   node tools/split.mjs            (refuses to overwrite an existing src/)
import fs from 'node:fs'; import path from 'node:path'; import url from 'node:url';
const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src');
if (fs.existsSync(SRC) && !process.argv.includes('--force')) { console.error('src/ already exists'); process.exit(1); }

// feature of a piece of code, from its header text (first comment) — ordered rules, first match wins
const RULES = [
  ['lab', /\blab\d*\b|\blab[A-Z]|hani|voice|\bstl\b|3d viewer|work-order|لابراتوار|\bl\d+[a-z]?:|\bh9b\b/i],
  ['other-clinics', /\boc\d|سایر کلینیک|other clinic/i],
  ['pdf', /\bpdf\b|q8|receipt|print|چاپ/i],
  ['inventory', /\binv\d*\b|inventory|انبار|fixture|stock|storekeeper|\bpa9\b/i],
  ['prosthesis', /\bpros|پروتز|psess|ponly|\bpref\b|abutment|pontic|روکش|impression|قالب/i],
  ['surgery', /surg|جراحی|\brx\b|post-op|discharge|ترخیص|\bpa[58]\b|implant reason/i],
  ['appointments', /\bappt|appointment|calendar|نوبت|\bbk\d/i],
  ['reception', /reception|queue|intake|walk|پذیرش|duplicate|national id|tiles|کاشی/i],
  ['consultant', /consult|مشاور|undecided|\bpl\d+\b|summary for the patient|consent|signature|patient link/i],
  ['finance', /\bfin\d*\b|\bfin[A-Z]|pay|cash|cheque|\bchq|money|\bpos\b|discount|تخفیف|settle|refund|balance|\bfx4\b|\bdep1\b|\bo3s\b|accountant|accounting|\bxl\d*\b|اکسل|حساب/i],
  ['archive', /\barc\d*\b|archive|paper|بایگانی|patient file|timeline|\bhist\b|forgotten/i],
  ['manager', /manager|\bmgr|dashboard|report|accounts|password|users|\bsec\d|کاربران|مدیر/i],
  ['plan', /model|calc|form render|serialization|tariff|brand|totals|\bgd\d*\b|guide|\bpk\d\b|treatment plan|طرح/i],
  ['ui', /\bux\d*\b|\bui\b|theme|bdrop|\bttl\d|title|toast|zoom|مربع|install as app|\bmsg\d/i],
  ['core', /./],
];
// score every feature over the header (weight 5) and the first 6000 chars of code (identifiers like labNew, surgSave, payAdd)
const KW = {
  lab: /\blab[A-Z0-9_]\w*|\blab\b|hani|lab_|l[2-8][A-Z]\w*|LAB_|لابراتوار|stl|voice/g,
  'other-clinics': /\boc\d\w*|OC\d|سایر کلینیک/g,
  pdf: /\bpdf\w*|PDF|buildPDF|q8\w*|textBlock|jpegPDF|receipt/g,
  inventory: /\binv\w*|INV\w*|انبار|stock|fixture|kit/g,
  prosthesis: /\bpros\w*|PROS\w*|پروتز|psess|abut|pontic|impr\b|crown/g,
  surgery: /\bsurg\w*|SURG\w*|جراحی|rxG\w*|discharge|ترخیص|surgDay/g,
  appointments: /\bappt\w*|APPT\w*|calendar|نوبت|bk1/g,
  reception: /reception|queue\w*|intake|پذیرش|walk|tile\w*|staff/g,
  consultant: /consult\w*|مشاور|undecided|\bpl(9|10|11)\w*|outSheet|confirm\w*|patLink|sign\w*/g,
  finance: /\bfin\w*|FIN\w*|\bpay\w*|cash\w*|chq\w*|cheque|money|pos[A-Z]\w*|disc\w*|settle\w*|refund\w*|\bbal\b|fx4\w*|dep\w*|acct|accountant|xl\w*|تخفیف|حساب/g,
  archive: /\barc\d*\w*|ARC\w*|archive|paper|بایگانی|timeline|fxArc|fx5\w*/g,
  manager: /manager|mgr\w*|MGR\w*|report\w*|dashboard|users?\b|userSave|password|\bpw\b|مدیر/g,
  plan: /\bcalc\w*|totals|tariff|brand\w*|planTotal|toDoc|fromDoc|recalc|\bpk\d\w*|implant[A-Z]\w*|طرح/g,
  ui: /\bux\d\w*|theme|toast|bdrop|ttl\d\w*|zoom|appbar|tile/g,
};
const feature = (head, code = '') => { const sc = {}; for (const [f, re] of Object.entries(KW)) sc[f] = (head.match(re) || []).length * 5 + (code.slice(0, 6000).match(re) || []).length;
  const best = Object.entries(sc).sort((a, b) => b[1] - a[1])[0]; return best && best[1] >= 4 ? best[0] : 'core'; };
const STOP = new Set(['owner', 'the', 'a', 'an', 'of', 'and', 'for', 'to', 'in', 'on', 'is', 'with', 'by', 'from', 'it', 'at', 'as', 'or', 'be', 'are', 'this', 'that']);
const slug = s => (String(s).replace(/[^\x20-\x7e]+/g, ' ').toLowerCase().replace(/\b20\d\d-\d\d-\d\d\b/g, ' ').replace(/[^a-z0-9]+/g, '-').split('-').filter(w => w && !STOP.has(w) && !/^\d+$/.test(w)).slice(0, 5).join('-') || 'part');
const used = new Set();
const uniq = p => { let q = p, k = 2; while (used.has(q)) { q = p.replace(/(\.\w+)$/, `-${k++}$1`); } used.add(q); return q; };
const headerOf = t => { const m = t.match(/\/\*[\s-]*([^\s-][^\n]{0,240}?)(?:\*\/|-{6}|\n|$)/); return m ? m[1].trim() : t.slice(0, 120); };
const tagOf = h => { const m = h.match(/^([a-z][a-z0-9]*(?:[a-z0-9.-]*[a-z0-9])?)\b/i); return m ? m[1] : ''; };

function writePart(rel, text) { const f = path.join(SRC, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); return rel; }

// top-level <style>/<script> blocks (none of them has attributes)
function blocks(s) {
  const out = []; let i = 0; const re = /<(style|script)>/g; let m;
  while ((m = re.exec(s))) { const tag = m[1], a = m.index + m[0].length, close = `</${tag}>`, b = s.indexOf(close, a); if (b < 0) throw new Error('unclosed ' + tag);
    out.push({ raw: s.slice(i, a) }); out.push({ tag, inner: s.slice(a, b) }); i = b; re.lastIndex = b + close.length; }
  out.push({ raw: s.slice(i) }); return out;
}
// cut text at lines matching re (the matching line starts the next piece)
function cutAt(text, re) { const L = text.split('\n'), pieces = []; let cur = [];
  L.forEach((l, k) => { if (k > 0 && re.test(l) && cur.length) { pieces.push(cur.join('\n') + '\n'); cur = []; } cur.push(l); });
  const last = cur.join('\n'); if (last.length || !pieces.length) pieces.push(last); return pieces; }

// a large CSS piece: cut at column-0 comments that sit outside every rule (brace depth 0), so each file is whole rules
function cutCss(text) {
  const L = text.split('\n'), pieces = []; let cur = [], depth = 0, inC = false;
  L.forEach((l, k) => {
    if (k > 0 && depth === 0 && !inC && /^\/\*/.test(l) && cur.join('\n').length > 2000) { pieces.push(cur.join('\n') + '\n'); cur = []; }
    cur.push(l);
    for (let i = 0; i < l.length; i++) { const c = l[i], n = l[i + 1];
      if (inC) { if (c === '*' && n === '/') { inC = false; i++; } continue; }
      if (c === '/' && n === '*') { inC = true; i++; continue; }
      if (c === '"' || c === "'") { const q = c; i++; while (i < l.length && l[i] !== q) { if (l[i] === '\\') i++; i++; } continue; }
      if (c === '{') depth++; else if (c === '}') depth = Math.max(0, depth - 1); }
  });
  const last = cur.join('\n'); if (last.length || !pieces.length) pieces.push(last); return pieces;
}
function splitPage(name, file, opt) {
  const s = fs.readFileSync(path.join(root, file), 'utf8'), parts = [], dir = name; let jsN = 0, cssN = 0;
  const nameOf = (h, fallback) => { const t = tagOf(h);
    if (t && /\d/.test(t)) { const rest = slug(h.slice(t.length)); return t.toLowerCase() + (rest !== 'part' ? '-' + rest.split('-').slice(0, 4).join('-') : ''); }
    const all = slug(h); return all !== 'part' ? all : fallback; };
  const pushJs = (code, label) => { const h = headerOf(code), f = opt.flat ? `${dir}/script${jsN ? '-' + jsN : ''}.js` : uniq(`${dir}/scripts/${feature(h, code)}/${nameOf(h, label === 'core' ? 'app-start' : 'layer')}.js`); jsN++; parts.push({ file: writePart(f, code) }); };
  const pushCss = (code) => { const h = headerOf(code), f = opt.flat ? `${dir}/style${cssN ? '-' + cssN : ''}.css` : uniq(`${dir}/styles/${feature(h, code)}/${nameOf(h, 'base')}.css`); cssN++; parts.push({ file: writePart(f, code) }); };
  for (const b of blocks(s)) {
    if (b.raw !== undefined) {
      if (opt.markup && /<body[\s>]/.test(b.raw)) { // the body markup: one file per region, images out as binary files
        const k = b.raw.search(/<body[\s>]/), kk = b.raw.indexOf('>', k) + 1; parts.push({ raw: b.raw.slice(0, kk) });
        let n = 0; for (const piece of cutAt(b.raw.slice(kk), /^\s*<!--/)) { n++;
          const re = /data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)/g; let m, i = 0, img = 0;
          const label = (piece.match(/<!--\s*([^>]{0,60}?)\s*-->/) || [, 'markup'])[1];
          while ((m = re.exec(piece))) { const pre = piece.slice(i, m.index) + `data:image/${m[1]};base64,`; if (pre) parts.push({ file: writePart(uniq(`${dir}/markup/${String(n).padStart(2, '0')}-${slug(label)}.html`), pre) });
            const ext = m[1] === 'jpeg' ? 'jpg' : 'png', buf = Buffer.from(m[2], 'base64'); if (buf.toString('base64') !== m[2]) throw new Error('base64 not canonical');
            parts.push({ image: writePart(uniq(`${dir}/assets/${slug(label)}-${++img}.${ext}`), buf) }); i = m.index + m[0].length; }
          const rest = piece.slice(i); if (rest) parts.push({ file: writePart(uniq(`${dir}/markup/${String(n).padStart(2, '0')}-${slug(label)}.html`), rest) }); }
      } else parts.push({ raw: b.raw });
    } else if (b.tag === 'style') { if (opt.flat) pushCss(b.inner); else for (const piece of cutAt(b.inner, /^\/\* ---------- /)) { if (piece.length > 30000) for (const p2 of cutCss(piece)) pushCss(p2); else pushCss(piece); } }
    else { // script
      if (!opt.flat && b.inner.length > 500000) { for (const piece of cutAt(b.inner, /^\/\* ---------- /)) pushJs(piece, 'core'); }
      else pushJs(b.inner, 'layer'); }
  }
  const back = parts.map(p => p.raw ?? (p.file ? fs.readFileSync(path.join(SRC, p.file), 'utf8') : 'data:'));
  fs.writeFileSync(path.join(SRC, dir, 'page.json'), JSON.stringify({ out: file, parts }, null, 1) + '\n');
  console.log(file, '→', `src/${dir}/`, parts.filter(p => p.file).length, 'files,', parts.filter(p => p.image).length, 'images');
}
splitPage('app', 'index.html', { markup: true });
for (const [n, f] of [['patient-link', 'p.html'], ['intake', 'f.html'], ['probe', 'probe.html']]) splitPage(`pages/${n}`, f, { flat: true });
