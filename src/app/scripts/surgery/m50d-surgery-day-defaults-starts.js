/* ---------- m50d (owner, 2026-11-18): surgery day defaults — «این آخرین جلسه است» starts ticked, «فردا: چک بی‌حسی» starts unticked.
   A draft of the same day keeps its own follow-up ticks; the edit of a stored session (m43b) and paper files set their own values after this. Page only. ---------- */
{ const _o = openSurg; openSurg = function (x) { const draft0 = (() => { try { return !!localStorage.getItem(SGDK(x && x.id)) } catch (e) { return false } })(); const r = _o.apply(this, arguments);
  try { if (SURG && !SURG.arc) { const f = $('sg_fin'); if (f && !f.disabled) f.checked = true; if (!(draft0 && SURG.dirty)) { const n = document.querySelector('#viewSurg [data-fu="numb"]'); if (n && !n.disabled) n.checked = false } } } catch (e) { console.error('m50d', e) }
  return r } }
