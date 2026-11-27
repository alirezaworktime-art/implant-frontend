/* ---------- m5: (marker) ---------- */
/* ---------- m5: «مالی ← سهم پزشکان» — the detail per doctor: pick a doctor (or tap a row of «جمع سهم هر پزشک») → his services table, a per-service summary, Excel / print; «اکسل همه به تفکیک پزشک» (one sheet each) and «چاپ همه» (one page each) ---------- */
M1.doc = '';
const m5Rows = (d, n) => d.docs.rows.filter(r => (r.doc || '—') === n);
const m5Svc = rows => { const o = {}; rows.forEach(r => { const k = r.svc || '—', x = o[k] || (o[k] = { svc: k, qty: 0, amt: 0, fee: 0 }); x.qty += Number(r.qty) || 0; x.amt += Number(r.amt) || 0; x.fee += Number(r.fee) || 0 }); return Object.values(o).sort((a, b) => b.fee - a.fee) };
const M5_COLS = [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'pat', l: 'بیمار' }, { k: 'file', l: 'پرونده' }, { k: 'svc', l: 'خدمت' }, { k: 'qty', l: 'تعداد', t: 'n' }, { k: 'amt', l: 'مبلغ خدمت', t: 'm' }, { k: 'fee', l: 'سهم', t: 'm' }, { k: 'note', l: 'توضیح' }];
const M5_SCOLS = [{ k: 'svc', l: 'خدمت' }, { k: 'qty', l: 'تعداد', t: 'n' }, { k: 'amt', l: 'مبلغ خدمات', t: 'm' }, { k: 'fee', l: 'سهم', t: 'm' }];
const m5Id = n => 'm5d' + Array.from(String(n)).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36);
{ const _s = m1Sec; m1Sec = function () { const d = M1.d; if (!d || !d.ok || M1.sec !== 'docs') return _s.apply(this, arguments);
  const names = d.docs.by.map(x => x.name); if (M1.doc && !names.includes(M1.doc)) M1.doc = '';
  const sub = `${jDay(d.from)} تا ${jDay(d.to)}`;
  const bar = `<div class="m5bar"><label class="f">ریز سهم<select id="m5Doc"><option value="">همه‌ی پزشکان و همکاران</option>${names.map(n => `<option value="${esc(n)}"${n === M1.doc ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
    <button type="button" class="btn sm ghost" id="m5AllX">⬇ اکسل همه به تفکیک پزشک</button><button type="button" class="btn sm ghost" id="m5AllP">🖨 چاپ همه (هر پزشک یک صفحه)</button></div>`;
  let h = _s.apply(this, arguments);
  h = h.replace('<h3>سهم پزشکان و همکاران</h3>', '<h3>سهم پزشکان و همکاران</h3>' + bar);
  if (!M1.doc) return h;
  const R = m5Rows(d, M1.doc), S = m5Svc(R), tot = R.reduce((a, r) => a + (Number(r.fee) || 0), 0);
  const one = `<div class="m5one"><div class="kv"><span>پزشک / همکار</span><span><b>${esc(M1.doc)}</b></span><span>بازه</span><span>${esc(sub)}</span><span>تعداد خدمت</span><span>${fa(R.length)}</span><span>جمع سهم</span><span><b>${money(tot)}</b></span></div>
    ${FT('m5svc', 'سهم ' + M1.doc + ' به تفکیک خدمت', M5_SCOLS, S, { sum: ['qty', 'amt', 'fee'], sub })}
    ${FT('m5det', 'ریز سهم ' + M1.doc, M5_COLS, R, { sum: ['amt', 'fee'], sub, cap: 1000, land: 1 })}
    <div class="btns"><button type="button" class="btn sm ghost" data-fx="x:m5svc,m5det">⬇ اکسل این پزشک (دو برگه)</button><button type="button" class="btn sm ghost" data-fx="p:m5svc,m5det">🖨 چاپ صورت‌حساب این پزشک</button></div></div>`;
  /* the detail of one doctor replaces the all-doctors detail table */
  return h.replace(/<div class="ftw" data-ft="m1docr">[\s\S]*$/, one + '</div>') } }
/* the all-doctors summary rows open that doctor */
{ const _r = m1Render; m1Render = function () { const r = _r.apply(this, arguments); try { if (M1.sec !== 'docs' || !M1.d || !M1.d.ok) return r; const t = document.querySelector('[data-ft="m1docs"] tbody'); if (!t) return r;
  [...t.querySelectorAll('tr')].forEach(tr => { const td = tr.querySelector('td'); if (!td) return; const n = td.textContent.trim(); if (!M1.d.docs.by.some(x => x.name === n)) return; tr.classList.add('m5pick'); tr.dataset.m5n = n; tr.title = 'ریز سهم ' + n; tr.setAttribute('tabindex', '0') }) } catch (e) {} return r } }
document.addEventListener('change', e => { if (e.target && e.target.id === 'm5Doc') { M1.doc = e.target.value; m1Render() } });
document.addEventListener('click', e => { const tr = e.target && e.target.closest && e.target.closest('tr.m5pick'); if (tr) { M1.doc = tr.dataset.m5n; m1Render(); const x = document.querySelector('.m5one'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  const b = e.target && e.target.closest && e.target.closest('#m5AllX,#m5AllP'); if (!b || !M1.d || !M1.d.ok) return; const d = M1.d, sub = `${jDay(d.from)} تا ${jDay(d.to)}`, ids = [];
  d.docs.by.forEach(x => { const id = m5Id(x.name), R = m5Rows(d, x.name); FT(id + 's', 'سهم ' + x.name + ' به تفکیک خدمت — جمع ' + nf(x.fee), M5_SCOLS, m5Svc(R), { sum: ['qty', 'amt', 'fee'], sub }); FT(id, 'ریز سهم ' + x.name, M5_COLS, R, { sum: ['amt', 'fee'], sub, land: 1 }); ids.push(id + 's', id) });
  if (!ids.length) { toast('در این بازه سهمی نیست.', 1); return }
  if (b.id === 'm5AllX') { const S = d.docs.by.map(x => { const id = m5Id(x.name), a = ftSheet(id + 's'), c = ftSheet(id); a.rows = a.rows.concat([[]], [c.head], c.rows); if (c.foot) a.rows.push(c.foot); a.name = String(x.name).replace(/[\\\/?*\[\]:]/g, ' ').slice(0, 30) || 'پزشک'; return a });
    xlsx(S, 'سهم-پزشکان-' + toEn(jDay(d.from)).replace(/\//g, '-') + '-تا-' + toEn(jDay(d.to)).replace(/\//g, '-')); return }
  let html = ftPrintDoc(ids, 'سهم پزشکان به تفکیک — ' + sub), k = 0; html = html.replace('</style>', 'h2.m5brk{page-break-before:always}</style>').replace(/<h2>(سهم [^<]* به تفکیک خدمت)/g, (m, t) => (k++ ? '<h2 class="m5brk">' : '<h2>') + t);
  printHTML(html) });
document.addEventListener('keydown', e => { const tr = e.target && e.target.closest && e.target.closest('tr.m5pick'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tr.click() } });
/* ---- «ایمپلنت‌های مصرفی»: a fifth card — which sizes went to which patients / file numbers in the period ---- */
M1.isz = '';
const m5Sz = r => [r.b, r.sys].filter(Boolean).join(' ') + (r.d ? ' ' + faD(String(r.d)) + (r.l ? '×' + faD(String(r.l)) : '') : '');
{ const _c = m1Cards; m1Cards = function () { let h = _c.apply(this, arguments); const d = M1.d || {}, ok = d && d.ok && d.imp;
  return h.replace(/<\/div>$/, `<button type="button" class="kpi" data-m1sec="imp" aria-pressed="${M1.sec === 'imp'}"><span>ایمپلنت‌های مصرفی</span><b>${ok ? fa(d.imp.n) : '—'}</b><span>${ok ? 'به تفکیک سایز و بیمار' : ''}</span></button></div>`) } }
{ const _s = m1Sec; m1Sec = function () { const d = M1.d; if (!d || !d.ok || M1.sec !== 'imp') return _s.apply(this, arguments);
  const I = d.imp || { rows: [] }, sub = `${jDay(d.from)} تا ${jDay(d.to)}`, S = {};
  I.rows.forEach(r => { const k = m5Sz(r) || '—', x = S[k] || (S[k] = { sz: k, b: r.b, d: r.d, l: r.l, n: 0, p: new Set() }); x.n += r.n; x.p.add(r.pat + '|' + r.file) });
  const sizes = Object.values(S).sort((a, b) => String(a.b).localeCompare(String(b.b), 'fa') || (parseFloat(a.d) || 0) - (parseFloat(b.d) || 0) || (parseFloat(a.l) || 0) - (parseFloat(b.l) || 0)).map(x => ({ sz: x.sz, n: x.n, pc: x.p.size }));
  if (M1.isz && !S[M1.isz]) M1.isz = ''; const R = M1.isz ? I.rows.filter(r => (m5Sz(r) || '—') === M1.isz) : I.rows;
  return `<div class="card"><h3>ایمپلنت‌های مصرفی</h3>${I.err ? '<p class="msg err">خواندن مصرف انبار ممکن نشد.</p>' : ''}<p class="note">هر فیکسچری که در این بازه در جراحی یا پرونده‌ی کاغذی از انبار کم شده؛ برگشتی‌ها کم شده‌اند. روی یک سایز بزنید تا بیماران همان سایز بیایند.</p>
    ${FT('m5isz', 'به تفکیک سایز', [{ k: 'sz', l: 'برند / سیستم / قطر×طول' }, { k: 'n', l: 'تعداد', t: 'n' }, { k: 'pc', l: 'تعداد بیمار', t: 'n' }], sizes, { sum: ['n'], sub })}
    <div class="m5bar"><label class="f">سایز<select id="m5Sz"><option value="">همه‌ی سایزها</option>${sizes.map(x => `<option value="${esc(x.sz)}"${x.sz === M1.isz ? ' selected' : ''}>${esc(x.sz)} (${fa(x.n)})</option>`).join('')}</select></label></div>
    ${FT('m5imp', 'ایمپلنت‌های مصرفی' + (M1.isz ? ' — ' + M1.isz : ''), [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'pat', l: 'بیمار' }, { k: 'file', l: 'شماره پرونده' }, { k: 'tooth', l: 'دندان', v: r => r.tooth ? toothTxt([r.tooth]) : '' }, { k: 'b', l: 'برند' }, { k: 'sys', l: 'سیستم' }, { k: 'd', l: 'قطر', v: r => r.d ? faD(String(r.d)) : '' }, { k: 'l', l: 'طول', v: r => r.l ? faD(String(r.l)) : '' }, { k: 'n', l: 'تعداد', t: 'n' }, { k: 'paper', l: 'توضیح', v: r => [r.paper ? 'پرونده‌ی کاغذی' : '', r.fail ? 'فیل' : ''].filter(Boolean).join('، ') }], R, { sum: ['n'], sub, cap: 1000, land: 1 })}</div>` } }
{ const _r = m1Render; m1Render = function () { const r = _r.apply(this, arguments); try { if (M1.sec !== 'imp') return r; document.querySelectorAll('[data-ft="m5isz"] tbody tr').forEach(tr => { const td = tr.querySelector('td'); if (!td || !td.textContent.trim() || tr.querySelector('.empty')) return; tr.classList.add('m5pick'); tr.dataset.m5s = td.textContent.trim(); tr.setAttribute('tabindex', '0') }) } catch (e) {} return r } }
document.addEventListener('change', e => { if (e.target && e.target.id === 'm5Sz') { M1.isz = e.target.value; m1Render() } });
document.addEventListener('click', e => { const tr = e.target && e.target.closest && e.target.closest('tr.m5pick[data-m5s]'); if (!tr) return; e.stopImmediatePropagation(); M1.isz = tr.dataset.m5s; m1Render(); const x = document.querySelector('[data-ft="m5imp"]'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, true);
