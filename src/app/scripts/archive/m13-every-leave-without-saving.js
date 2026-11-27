/* ---------- m13: every «leave without saving?» dialog is just «تغییرات ذخیره شوند؟» بله / نه — بله saves, نه drops the changes and the record stays as it was (owner, 2026-11-11) ---------- */
m4Ask = function (d) { return new Promise(res => { let s = $('m4Sh'); if (!s) { s = document.createElement('div'); s.className = 'sheet'; s.id = 'm4Sh'; document.body.appendChild(s) }
  s.innerHTML = `<div class="in m4in m13in" role="dialog" aria-modal="true" aria-labelledby="m4T"><h3 id="m4T">تغییرات ذخیره شوند؟</h3><div class="msg" id="m4Msg" role="alert"></div>
    <div class="btns"><button type="button" class="btn" data-m4a="save">بله</button><button type="button" class="btn ghost" data-m4a="drop">نه</button></div></div>`;
  s.hidden = false; const done = v => { s.hidden = true; s.onclick = null; document.removeEventListener('keydown', esc1, true); res(v) };
  const esc1 = e => { if (e.key === 'Escape' && !s.hidden) { e.preventDefault(); done('back') } }; document.addEventListener('keydown', esc1, true);
  s.onclick = async e => { const b = e.target.closest && e.target.closest('[data-m4a]'); if (e.target === s) { done('back'); return } if (!b) return; e.stopPropagation(); const a = b.dataset.m4a; if (a !== 'save') { done(a); return }
    b.disabled = true; const m = $('m4Msg'); m.className = 'msg'; m.textContent = 'در حال ذخیره…'; let ok = false; try { ok = await d.save() } catch (er) { m.className = 'msg err'; m.textContent = 'ذخیره نشد: ' + er.message; b.disabled = false; return }
    if (ok) done('save'); else { done('back'); toast('ذخیره نشد؛ پیام قرمز صفحه را ببینید و کامل کنید.', true) } };
  setTimeout(() => { const b = s.querySelector('[data-m4a="save"]'); if (b) b.focus() }, 50) }) };
/* the older «خروج بدون ذخیره» questions (paper file, archive surgery day) ask the same thing */
{ const _u = uxAsk; uxAsk = function (o) { if (!(o && o.title === 'خروج بدون ذخیره')) return _u.apply(this, arguments);
  const save = async () => { if (SURG && SURG.arc) { await arcSave($('fxaGo') || document.createElement('button')); return false } if (A6 && $('a6Save')) { await a6Save($('a6Save')); return false } return false };
  return m4Ask({ save: async () => { await save(); return true } }).then(a => a === 'drop') } }
