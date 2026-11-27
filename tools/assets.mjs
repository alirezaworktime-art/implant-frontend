// The site files served by the server (ASSETS of the worker bundle), made from this repo. impyar-backend's build calls
// this, so all page knowledge lives here: which files, their routes and types, and the build-time values put into the
// pages (phone numbers, Apps Script id, e-mail). The values themselves come from the caller (never stored here).
//   import { siteAssets } from '<frontend>/tools/assets.mjs'
//   siteAssets({ values, tag, apk })  → { '/': {t,d,b}, … }   (same keys, order and bytes as before the split)
import fs from 'node:fs'; import path from 'node:path'; import url from 'node:url'; import { execFileSync } from 'node:child_process';
const fe = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const T = (f, enc) => fs.readFileSync(path.join(fe, f), enc);
const faN = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
export function siteAssets({ values = {}, tag = '', apk = null } = {}) {
  const S = values;
  const phone = t => { for (const [k, v] of Object.entries(S.PHONES || {})) if (v) t = t.split(k).join(v).split(faN(k)).join(faN(v)); return t; };
  const mail = t => t.split('sender@example.com').join(S.SENDER || 'sender@example.com').split('recipient@example.com').join(S.EMAIL_HINT || 'recipient@example.com');
  const gas = t => mail(phone(S.APPS_SCRIPT_DEPLOYMENT_ID ? t.split('APPS_SCRIPT_DEPLOYMENT_ID').join(S.APPS_SCRIPT_DEPLOYMENT_ID) : t));
  const H = 'text/html; charset=utf-8', J = 'text/javascript; charset=utf-8', P = 'image/png';
  const txt = (t, d) => ({ t, d, b: 0 }), bin = (t, buf) => ({ t, d: buf.toString('base64'), b: 1 });
  let index = gas(T('index.html', 'utf8'));
  if (tag) { let sha = ''; try { sha = execFileSync('git', ['-C', fe, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (e) { }
    const k = index.lastIndexOf('</body>'); index = index.slice(0, k) + `<!-- ---------- ${tag} (repo build${sha ? ' frontend ' + sha : ''}) -->\n` + index.slice(k); }
  const A = {
    '/': txt(H, index),
    '/manifest.webmanifest': txt('application/manifest+json; charset=utf-8', T('public/manifest.webmanifest', 'utf8')),
    '/sw.js': txt(J, T('public/sw.js', 'utf8')),
    '/p': txt(H, gas(T('p.html', 'utf8'))),
    '/probe': txt(H, gas(T('probe.html', 'utf8'))),
    '/icon-192.png': bin(P, T('public/icons/icon-192.png')), '/icon-512.png': bin(P, T('public/icons/icon-512.png')),
    '/icon-maskable-512.png': bin(P, T('public/icons/icon-maskable-512.png')), '/apple-touch-icon.png': bin(P, T('public/icons/apple-touch-icon.png')),
  };
  if (apk) A['/implant-plan.apk'] = apk;                    /* the tablet app comes from impyar-tablet (given by the caller) */
  Object.assign(A, {
    '/index.html': txt(H, index),
    '/f': { t: H, d: gas(T('f.html', 'utf8')) },
    '/pdf.min.mjs': txt(J, T('public/vendor/pdfjs/pdf.min.mjs', 'utf8')), '/pdf.worker.min.mjs': txt(J, T('public/vendor/pdfjs/pdf.worker.min.mjs', 'utf8')),
  });
  return A;
}
