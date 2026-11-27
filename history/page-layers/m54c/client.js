/* ---------- m54c (owner, 2026-11-18): the extra fields of m54a are not needed — taken away: the «مشخصات تکمیلی» card and sheet (patient file and
   reception form), the medical alerts (file and surgery day), cheque owner / warranty / satisfaction / complaint, and «ثبت تکمیلی جراحی».
   What stays from m54a: «بستن پرونده» (the card now shows only the closed banner and the close / open button), the result of follow-up calls,
   and the automatic tasks. ---------- */
function m54Card() { const B = $('pfBody'); if (!B || !PF || !PF.j || PF.sess) return; const D = M54.c[PF.id]; const old = $('m54Card'); if (old) old.remove(); if (!D) return;
  const c = D.c; if (!c && !m54Can()) return;
  B.insertAdjacentHTML('afterbegin', `<div class="m54card" id="m54Card">${c ? `<div class="m54cl">پرونده بسته شده است: ${esc(c.why || '')}${c.note ? ' — ' + esc(c.note) : ''}${c.by ? ' · ' + esc(c.by) : ''}</div>` : ''}${m54Can() ? `<div class="btns">${c ? '<button type="button" class="btn sm" id="m54Open">باز کردن دوباره‌ی پرونده</button>' : '<button type="button" class="btn sm ghost" id="m54CloseB">بستن پرونده</button>'}</div>` : ''}</div>`) }
function m54Mounts() { try { ['m54Rc', 'm54SgW', 'm54SgSh', 'm54Sh'].forEach(id => { const n = $(id); if (n) n.remove() }); const b = $('m54SgB'); if (b) { const w = b.closest('.btns'); (w || b).remove() } M54.pend = null; M54.sx = null } catch (e) { } }
m54Mounts();
