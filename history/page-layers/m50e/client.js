/* ---------- m50e (owner, 2026-11-18): surgery day, implant window — the brand had to be chosen again for every tooth when it was not the first brand of the
   plan's group (and for Italian plans it always went back to JD Plus). Now a tooth without a brand opens on the last brand picked in this session
   (after a reload: the brand of the last implant recorded in this session); only then the old defaults. All on X stays Italian. Page only. ---------- */
function m50eLast() { try { const cat = catM(); if (!cat.length || !SURG) return null; let c = cat[SURG.lastCat]; if (!c) { const L = Object.values(SURG.imp || {}).filter(m => m && m.b); const m = L[L.length - 1]; if (m) c = cat.find(x => x.b === m.b && (x.sys || '') === (m.sys || '')) } return c || null } catch (e) { return null } }
{ const _o = openImp; openImp = function (k, sid) { let tmp = false, had = false, old;
  try { if (SURG && !(SURG.imp[k] && SURG.imp[k].b)) { const c = m50eLast(); if (c && ((sid || 'imp') !== 'aox' || c.g === 'it')) { had = Object.prototype.hasOwnProperty.call(SURG.imp, k); old = SURG.imp[k]; SURG.imp[k] = Object.assign({}, old || {}, { b: c.b, sys: c.sys }); tmp = true } } } catch (e) { tmp = false }
  try { return _o.apply(this, arguments) } finally { if (tmp) { if (had) SURG.imp[k] = old; else delete SURG.imp[k] } } } }
