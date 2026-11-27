# impyar-frontend

Web front end of the Yazd implant clinic treatment-plan system (طرح درمان ایمپلنت یزد).
Plain HTML/CSS/JavaScript, no framework. Persian, right-to-left, Jalali dates.

## Layout
| Path | What it is |
|---|---|
| `src/app/` | The app (login, reception, doctor, consultant, surgery day, prosthesis, lab, stock, finance, manager): `page.json` (the order) + `markup/`, `styles/<feature>/`, `scripts/<feature>/`, `assets/` |
| `src/pages/patient-link/` | Patient page (opened from the patient's link) → `p.html` |
| `src/pages/intake/` | Patient intake form (link sent before the visit) → `f.html` |
| `src/pages/probe/` | Network / back-end speed test → `probe.html` |
| `public/` | Served as they are: `sw.js`, `manifest.webmanifest`, `icons/`, `vendor/pdfjs/` (Mozilla PDF.js, Apache-2.0) |
| `tools/` | `build.mjs` (build / `--check`), `assets.mjs` (the site files for the server bundle), `structure.mjs` (writes `docs/STRUCTURE.md`), `split.mjs` (one-time split, history) |
| `index.html`, `p.html`, `f.html`, `probe.html` | **Generated** by `node tools/build.mjs` — committed so the server build can take them; never edit or hand-merge them |
| `docs/STRUCTURE.md` | Every folder and file in run order (generated) |
| `history/page-layers/` | The page parts of the old patches m17 … m61a (history only, not built) |

Features: `appointments`, `archive`, `consultant`, `core`, `finance`, `inventory`, `lab`, `manager`, `other-clinics`, `pdf`,
`plan`, `prosthesis`, `reception`, `surgery`, `ui` — the same names under `scripts/` and `styles/`.

## Change something
1. Edit the file under `src/` (find it in `docs/STRUCTURE.md` or by search).
2. `node tools/build.mjs` → the root pages are rebuilt. `node tools/build.mjs --check` tells whether they match `src/`.
3. A new file: add it to `src/app/page.json` at the place it must run, then build (and `node tools/structure.mjs`).
4. Commit `src/` **and** the rebuilt pages together. GitHub checks they match (`Pages match src`), and the staging deploy
   rebuilds from `src/` if they do not.

Rules that keep the app exactly as it is:
- The order in `page.json` is the run order. Later code may extend a function defined earlier, so keep the order.
- All files of one `<script>` share one scope (classic scripts, no modules): a file may use names from earlier files.
  Editors may mark those names as undefined in a single file; that is expected.
- `.editorconfig` / `.vscode/settings.json` keep whitespace and line endings untouched on save. Do not reformat files.

## Run locally
With **impyar-backend** next to this folder: `cd ../impyar-backend && npm install && npm run dev`, then open http://127.0.0.1:8787/.
After a change here: `node tools/build.mjs`, restart `npm run dev`, reload.

## How it is served
The pages are not served from this repo. impyar-backend's build calls `tools/assets.mjs`, which returns the site files
(routes, types, and the build-time values put into the pages: phone numbers, Apps Script id, e-mail — the values come
from the server's local secrets, never from this repo). The same server answers the API, so the page talks to its own origin.

## Not in this repo
No passwords, keys or patient data. `APPS_SCRIPT_DEPLOYMENT_ID` and the phone numbers are placeholders filled at build time.
