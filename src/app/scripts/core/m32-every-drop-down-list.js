
/* ---------- m32 (owner, 2026-11-16): every drop-down list opens a searchable picker (type part of a name to narrow the list).
   The native <select> stays in the page (value, change/input events and all existing code keep working); only the way it opens changes. */
let M32 = null;
const m32Norm = s => String(s == null ? '' : s).toLowerCase()
  .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
  .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[آأإ]/g, 'ا').replace(/ة/g, 'ه').replace(/ؤ/g, 'و')
  .replace(/[‌‍‎‏ـً-ْ]/g, '').replace(/\s+/g, ' ').trim();
/* lists that the lab cartable already turned into its own searchable box (hidden select, data-l8ss) are left to it */
const m32Ok = s => !!(s && s.tagName === 'SELECT' && !s.multiple && !s.disabled && !(s.size > 1) && s.getAttribute('aria-hidden') !== 'true' && !s.hasAttribute('data-l8ss') && !(s.closest && s.closest('[data-m32off]')));
function m32Title(sel) {
  let t = sel.getAttribute('aria-label') || '';
  if (!t) { const l = (sel.labels && sel.labels[0]) || (sel.closest && sel.closest('label'));
    if (l) { const c = l.cloneNode(true); c.querySelectorAll('select,input,textarea,button,small,.note,.msg').forEach(x => x.remove()); t = c.textContent.replace(/\s+/g, ' ').trim() } }
  if (!t) t = sel.getAttribute('title') || '';
  if (!t) { const o = sel.options[0]; if (o && !o.value) t = o.textContent.trim() }
  return (t || 'انتخاب').slice(0, 60);
}
function m32Close(refocus) {
  const S = M32; if (!S) return; M32 = null;
  try { if (S.vv) window.visualViewport.removeEventListener('resize', S.vv) } catch (e) {}
  S.el.remove();
  if (S.uxa) try { if (!UXA) UXA = S.uxa } catch (e) {}
  if (refocus) try { const s = m32Sel(S); if (s) s.focus({ preventScroll: true }) } catch (e) {}
}
function m32Sel(S) { if (S.sel.isConnected) return S.sel; const s = S.id ? document.getElementById(S.id) : null; return s && s.tagName === 'SELECT' ? s : null }
function m32Pick(i) {
  const S = M32; if (!S) return; const it = S.items[i]; if (!it || it.dis) return;
  const sel = m32Sel(S); if (!sel || sel.disabled) { m32Close(false); return }
  let idx = -1; const o = sel.options[it.i];
  if (o && o.value === it.v && o.textContent === it.raw) idx = it.i;
  else for (let j = 0; j < sel.options.length; j++) if (sel.options[j].value === it.v && sel.options[j].textContent === it.raw) { idx = j; break }
  m32Close(true); if (idx < 0) return;
  if (sel.selectedIndex !== idx) { sel.selectedIndex = idx; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })) }
}
function m32Filter() {
  const S = M32; if (!S) return; const q = m32Norm(S.inp.value).split(' ').filter(Boolean); let n = 0, first = -1;
  S.items.forEach((it, i) => { const ok = q.every(w => it.n.includes(w)); it.b.hidden = !ok; if (ok) { n++; if (first < 0 && !it.dis) first = i } });
  S.groups.forEach(g => { g.el.hidden = !g.items.some(i => !S.items[i].b.hidden) });
  S.none.hidden = n > 0; S.cnt.textContent = q.length ? (typeof faN === 'function' ? faN(n) : n) + ' مورد' : '';
  if (S.act < 0 || S.items[S.act].b.hidden || q.length) m32Act(first, false);
}
function m32Act(i, scroll) {
  const S = M32; if (!S) return; if (S.act >= 0 && S.items[S.act]) S.items[S.act].b.classList.remove('act');
  S.act = i; if (i >= 0 && S.items[i]) { const b = S.items[i].b; b.classList.add('act'); if (scroll !== false) try { b.scrollIntoView({ block: 'nearest' }) } catch (e) {} } else if (S.list) S.list.scrollTop = 0;
}
function m32Move(d) {
  const S = M32; if (!S) return; const n = S.items.length; if (!n) return; let i = S.act;
  for (let k = 0; k < n; k++) { i += d; if (i < 0 || i >= n) return; if (!S.items[i].b.hidden && !S.items[i].dis) { m32Act(i, true); return } }
}
function m32Open(sel, seed) {
  if (M32) m32Close(false);
  const el = document.createElement('div'); el.className = 'm32ov'; el.setAttribute('data-m32', '1');
  el.innerHTML = '<div class="m32p" role="dialog" aria-modal="true"><div class="m32h"><b class="m32t"></b><button type="button" class="m32x" aria-label="بستن">×</button></div>' +
    '<div class="m32s"><input type="search" class="m32q" placeholder="جستجو…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="جستجو در فهرست"><small class="m32c"></small></div>' +
    '<div class="m32l" role="listbox" tabindex="-1"></div><p class="m32n" hidden>موردی پیدا نشد.</p></div>';
  const list = el.querySelector('.m32l'), inp = el.querySelector('.m32q'); el.querySelector('.m32t').textContent = m32Title(sel);
  const S = { sel, id: sel.id || '', el, inp, list, none: el.querySelector('.m32n'), cnt: el.querySelector('.m32c'), items: [], groups: [], act: -1 };
  const add = (o, i, g) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'm32o'; b.setAttribute('role', 'option'); b.dataset.m32i = String(S.items.length);
    const raw = o.textContent, t = raw.replace(/\s+/g, ' ').trim(); b.textContent = t || '—'; const dis = o.disabled || !!(g && g.disabled); if (dis) { b.disabled = true }
    if (i === sel.selectedIndex) { b.classList.add('cur'); b.setAttribute('aria-selected', 'true') } else b.setAttribute('aria-selected', 'false');
    if (!o.value && i === 0) b.classList.add('ph');
    list.appendChild(b); const k = S.items.length; S.items.push({ b, i, v: o.value, raw, n: m32Norm(t + (g ? ' ' + g.label : '')), dis }); return k };
  let i = 0;
  for (const c of sel.children) {
    if (c.tagName === 'OPTGROUP') { const h = document.createElement('div'); h.className = 'm32g'; h.textContent = c.label || ''; list.appendChild(h); const g = { el: h, items: [] }; S.groups.push(g);
      for (const o of c.children) if (o.tagName === 'OPTION') { if (!o.hidden) g.items.push(add(o, i, c)); i++ } }
    else if (c.tagName === 'OPTION') { if (!c.hidden) add(c, i, null); i++ }
  }
  document.body.appendChild(el); M32 = S;
  /* a list inside a confirm dialog: Esc must close the picker, not the dialog under it (that dialog listens on window, before this script) */
  try { if (typeof UXA !== 'undefined' && UXA) { S.uxa = UXA; UXA = null } } catch (e) {}
  const cur = S.items.findIndex(it => it.i === sel.selectedIndex); if (cur >= 0) { S.act = cur; S.items[cur].b.classList.add('act'); try { S.items[cur].b.scrollIntoView({ block: 'center' }) } catch (e) {} }
  el.addEventListener('mousedown', e => { if (e.target === el) { e.preventDefault(); m32Close(true) } e.stopPropagation() });
  el.addEventListener('pointerdown', e => e.stopPropagation());
  el.addEventListener('touchend', e => e.stopPropagation());
  el.addEventListener('click', e => { e.stopPropagation(); const t = e.target; if (t === el || (t.closest && t.closest('.m32x'))) { m32Close(true); return } const b = t.closest && t.closest('.m32o'); if (b) m32Pick(+b.dataset.m32i) });
  inp.addEventListener('input', m32Filter);
  if (window.visualViewport) { S.vv = () => { try { el.style.height = window.visualViewport.height + 'px'; el.style.top = window.visualViewport.offsetTop + 'px' } catch (e) {} }; window.visualViewport.addEventListener('resize', S.vv); S.vv() }
  let coarse = false; try { coarse = matchMedia('(pointer:coarse)').matches } catch (e) {}
  if (seed) { inp.value = seed; m32Filter() }
  if (!coarse || seed || S.items.length >= 8) try { inp.focus({ preventScroll: true }) } catch (e) {} else try { list.focus({ preventScroll: true }) } catch (e) {}
}
document.addEventListener('mousedown', e => { if (e.button) return; const s = e.target && e.target.closest && e.target.closest('select'); if (!m32Ok(s)) return; e.preventDefault(); try { s.focus({ preventScroll: true }) } catch (x) {} m32Open(s) }, true);
{ let T = null;
  document.addEventListener('touchstart', e => { const s = e.target && e.target.closest && e.target.closest('select'); const p = e.touches && e.touches[0]; T = m32Ok(s) && p ? { s, x: p.clientX, y: p.clientY } : null }, { capture: true, passive: true });
  document.addEventListener('touchend', e => { const t = T; T = null; if (!t || !e.cancelable) return; const p = e.changedTouches && e.changedTouches[0]; if (!p || Math.abs(p.clientX - t.x) > 10 || Math.abs(p.clientY - t.y) > 10) return;
    if (!t.s.isConnected || !m32Ok(t.s)) return; e.preventDefault(); m32Open(t.s) }, { capture: true, passive: false }); }
document.addEventListener('keydown', e => {
  if (M32) { const k = e.key;
    if (k === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); m32Close(true) }
    else if (k === 'ArrowDown') { e.preventDefault(); e.stopImmediatePropagation(); m32Move(1) }
    else if (k === 'ArrowUp') { e.preventDefault(); e.stopImmediatePropagation(); m32Move(-1) }
    else if (k === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); if (M32.act >= 0 && !M32.items[M32.act].b.hidden) m32Pick(M32.act) }
    else if (k === 'Tab') { e.preventDefault(); e.stopImmediatePropagation(); m32Close(true) }
    else { e.stopImmediatePropagation(); if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement !== M32.inp) try { M32.inp.focus({ preventScroll: true }) } catch (x) {} }
    return }
  const s = e.target; if (!m32Ok(s) || e.ctrlKey || e.metaKey) return; const k = e.key;
  /* Enter is left alone: in the dialogs it confirms the form, as before */
  if (k === ' ' || k === 'ArrowDown' || k === 'ArrowUp' || k === 'F4') { e.preventDefault(); e.stopPropagation(); m32Open(s) }
  else if (k.length === 1 && !e.altKey) { e.preventDefault(); e.stopPropagation(); m32Open(s, k) }
}, true);
window.addEventListener('popstate', () => { if (M32) m32Close(false) });
