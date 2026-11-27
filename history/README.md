# history

`page-layers/<tag>/` — the page parts (`client.js`, `css.css`, `page.html`) of the old incremental patches m17 … m61a,
moved here from impyar-backend `patches/` on 2026-11-27 (page code only lives in this repo). They are history: their code
is already inside `src/` (each layer is one file under `src/app/scripts/<feature>/` or `styles/<feature>/`, named after
its tag). They are not built and not served.

Since 2026-11-27 the app is no longer changed by patches: changes are made directly in `src/` (see README).
