/* ---------- m50c (owner, 2026-11-18): surgery day — the «فیل اولیه» choice moves from the plan treatments (right panel, beside «پایه ایمپلنت»)
   to the top of the out-of-plan list (left panel): it is recorded only if it happens. Page only. ---------- */
function m50cPf() { try { const B = $('sgPick2'); if (!B) return; const pf = document.querySelector('#sgPick [data-m31pf],#sgPick2 [data-m31pf]'); if (!pf) return; pf.classList.add('m50cpf'); const hd = B.querySelector('.sgh'), first = hd ? hd.nextElementSibling : B.firstElementChild; if (first !== pf) { if (hd) hd.insertAdjacentElement('afterend', pf); else B.insertBefore(pf, B.firstElementChild) } } catch (e) { } }
{ const _p = renderPick; renderPick = function () { const r = _p.apply(this, arguments); m50cPf(); return r } }
