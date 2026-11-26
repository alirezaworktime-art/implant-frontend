# impyar-frontend

Web front end of the Yazd implant clinic treatment-plan system (طرح درمان ایمپلنت یزد).
Plain HTML/CSS/JavaScript, no framework and no build step. Persian, right-to-left, Jalali dates.

| File | What it is |
|---|---|
| `index.html` | The whole app: login, reception, doctor, consultant, surgery day, prosthesis, lab, stock, finance, settings. One file (~2.7 MB). |
| `p.html` | Patient page (opened from the patient's link) |
| `f.html` | Patient intake form (link sent before the visit) |
| `probe.html` | Network / back-end speed test |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installable app (PWA): network first, last copy when offline |
| `vendor/pdfjs/` | Mozilla PDF.js (Apache-2.0), used to show uploaded PDFs |

PDF files of the treatment plan are drawn on a canvas and assembled by the app itself (no PDF library).

## Run locally
With **impyar-backend** next to this folder: `cd ../impyar-backend && npm install && npm run dev`, then open http://127.0.0.1:8787/.
Edit a file here, restart `npm run dev`, reload. See impyar-backend `docs/DEVELOPMENT.md` and `docs/ARCHITECTURE.md`.

## How it is served
The pages are not served from this repo. They are embedded in the back-end bundle (`ASSETS` map) and served by the same
server that answers the API, so the page talks to its own origin. See **impyar-backend** → `scripts/build-bundle.mjs`.

Live: the Iran server (primary) and a Cloudflare Worker (nightly backup copy).

## Not in this repo
`APPS_SCRIPT_DEPLOYMENT_ID` is a placeholder for the Google Apps Script deployment (PDF copy in Drive, e-mail).
The build fills it from a local secrets file. No passwords, keys or patient data are stored here.

## History
The code was changed by incremental patches (`m17` … `m61a`); each patch, its spec and its tests are in
**impyar-backend** → `patches/`. This repo is the state of **m61a** (2026-11-23).
