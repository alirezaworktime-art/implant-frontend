/* ---------- m1: «مالی» — one page for the manager and the accountant: period chips, four cards (receipts · patient debts · doctors' shares · profit), a table per card with Excel / print. The old finance tiles (حسابداری کامل، صندوق و هزینه، داشبورد / گزارش‌های مدیریتی، دفتر اکسل، چک‌ها) fold under «بیشتر ▾». ---------- */
const M1 = { pk: 'm', per: null, sec: 'rcv', d: null, busy: false, more: false };
const M1_PRE = [['t', 'امروز'], ['w', 'این هفته'], ['m', 'این ماه'], ['pm', 'ماه قبل'], ['q3', 'سه ماه اخیر'], ['yr', 'امسال'], ['c', 'دلخواه']];
const M1_HIDE = { manager: ['dash', 'mrep', 'fin', 'acc'], accountant: ['xl', 'chq', 'fin'] };
const M1_KIND = { cash: 'نقد', card: 'کارتخوان', chq: 'چک', arc: 'پرونده‌ی کاغذی', bank: 'بانک' };
const m1Cat = k => { try { const e = EXPC.find(x => x[0] === k); if (e) return e[1] } catch (e) {} return k || '' };
(function () { const s = document.createElement('section'); s.id = 'viewM1'; s.className = 'wrap'; s.style.padding = '0'; s.hidden = true; s.innerHTML = '<div id="m1Root" class="m1"></div>'; const o = $('viewInv'); if (o && o.parentNode) o.parentNode.insertBefore(s, o.nextSibling); else document.body.appendChild(s); })();
{ const _s = show; show = function (v) { const r = _s.apply(this, arguments); const el = $('viewM1'); if (el) el.hidden = v !== 'm1'; return r } }
{ const _t = ttlNow; ttlNow = function () { const el = $('viewM1'); if (el && !el.hidden) return 'مالی'; return _t.apply(this, arguments) } }
for (const role of ['manager', 'accountant']) { const _t = TILES[role]; if (!_t) continue; TILES[role] = () => { let L = _t(); const H = M1_HIDE[role];
  if (!M1.more && H.includes(TSAVE[role] || '')) M1.more = true;
  const T = { k: 'm1', c: 'fin', l: 'مالی', s: 'دریافتی، بدهی بیماران، سهم پزشکان، سود', n: 0, m1: 1 };
  const i = L.findIndex(t => H.includes(t.k)); const hid = L.filter(t => H.includes(t.k)); L = L.filter(t => !H.includes(t.k)); L.splice(i < 0 ? 0 : Math.min(i, L.length), 0, T);
  if (hid.length) { if (M1.more) L = L.concat(hid); L.push({ k: 'm1more', c: 'set', l: M1.more ? 'کمتر ▴' : 'بیشتر ▾', s: M1.more ? 'پنهان کردن بخش‌های پیشرفته' : hid.map(t => t.l).join('، '), n: 0, m1more: 1 }); }
  return L } }
{ const _g = goTile; goTile = function (k, opt = {}) { const t = tileList().find(x => x.k === k); if (!t) return _g.apply(this, arguments);
  if (t.m1more) { M1.more = !M1.more; renderTiles(); return }
  if (!t.m1) return _g.apply(this, arguments);
  if (typeof dirty !== 'undefined' && dirty && !$('viewForm').hidden) return;
  TILE = 'm1'; TSAVE[ROLE] = TILE; try { localStorage.setItem('implantTile', JSON.stringify(TSAVE)) } catch (e) {} document.body.dataset.tile = TILE;
  show('m1'); renderTiles(); if (!opt.keep) window.scrollTo(0, 0); m1Render(); m1Load() } }
function m1Per() { if (!M1.per) { M1.per = i2Range('m'); M1.pk = 'm' } return M1.per }
async function m1Load() { if (M1.busy) return; M1.busy = true; const p = m1Per(); try { const j = await api('m1Rep', { from: p.from, to: p.to }); M1.d = j; } catch (e) { M1.d = { error: e.message } } finally { M1.busy = false } m1Render() }
function m1Head() { const p = m1Per(), c = M1.pk === 'c';
  return `<div class="card m1top"><div class="m1per"><span class="chips">${M1_PRE.map(([k, l]) => `<button type="button" class="chip" data-m1pre="${k}" aria-pressed="${M1.pk === k}">${l}</button>`).join('')}</span>
    <div class="m1dates"${c ? '' : ' hidden'}><label class="f">از<input id="m1From" inputmode="numeric" value="${esc(jDay(p.from))}"></label><label class="f">تا<input id="m1To" inputmode="numeric" value="${esc(jDay(p.to))}"></label><button type="button" class="btn sm" id="m1Go">نمایش</button></div>
    <small class="note">بازه: ${esc(jDay(p.from))} تا ${esc(jDay(p.to))}</small></div>
    <div class="m1links">${ROLE === 'manager' ? '<button type="button" class="btn sm ghost" data-m1go="acc">ثبت هزینه / صندوق</button><button type="button" class="btn sm ghost" data-m1go="dash">داشبورد</button>' : '<button type="button" class="btn sm ghost" data-m1go="xl">دفتر اکسل</button><button type="button" class="btn sm ghost" data-m1go="chq">چک‌های سررسید</button>'}<button type="button" class="btn sm ghost" data-m1go="fin">حسابداری کامل</button></div></div>` }
function m1Cards() { const d = M1.d || {}, ok = d && d.ok, v = x => ok ? nf(x) : '—';
  const C = [['rcv', 'دریافتی از بیماران', ok ? d.rcv.total : 0, ok ? `نقد ${nf(d.rcv.by.cash)} · کارت ${nf(d.rcv.by.card)} · چک ${nf(d.rcv.by.chq)}` : 'در حال بارگذاری…'],
    ['debt', 'بدهی بیماران (تا امروز)', ok ? d.debt.total : 0, ok ? `${fa(d.debt.n)} بیمار` : ''],
    ['docs', 'سهم پزشکان', ok ? d.docs.total : 0, ok ? `${fa(d.docs.by.length)} پزشک / همکار` : ''],
    ['pl', 'سود', ok ? d.profit : 0, ok ? `هزینه‌ها ${nf(d.exp.total)} · مواد ${nf(d.mat.total)}` : '']];
  return `<div class="kpis m1k">${C.map(([k, l, n, s]) => `<button type="button" class="kpi${k === 'pl' && ok && n < 0 ? ' out' : ''}" data-m1sec="${k}" aria-pressed="${M1.sec === k}"><span>${l}</span><b>${v(n)}</b><span>${esc(s)}</span></button>`).join('')}</div>` }
function m1Sec() { const d = M1.d; if (!d) return '<div class="card"><p class="note">در حال بارگذاری…</p></div>'; if (!d.ok) return `<div class="card"><p class="msg err">${esc(d.error || 'خطا')}</p></div>`;
  const sub = `${jDay(d.from)} تا ${jDay(d.to)}`;
  if (M1.sec === 'rcv') return `<div class="card"><h3>دریافتی‌ها</h3><div class="kv"><span>نقد</span><span>${money(d.rcv.by.cash)}</span><span>کارتخوان</span><span>${money(d.rcv.by.card)}</span><span>چک وصول‌شده (به سررسید)</span><span>${money(d.rcv.by.chq)}</span>${d.rcv.by.arc ? `<span>پرداخت‌های پرونده‌ی کاغذی</span><span>${money(d.rcv.by.arc)}</span>` : ''}<span><b>جمع دریافتی</b></span><span><b>${money(d.rcv.total)}</b></span>${d.rcv.wait ? `<span>چک‌های در انتظار وصول (سررسید در بازه)</span><span>${money(d.rcv.wait)}</span>` : ''}${d.rcv.bounce ? `<span>چک برگشتی</span><span>${money(d.rcv.bounce)}</span>` : ''}</div>
    ${FT('m1rcv', 'ریز دریافتی‌ها', [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'name', l: 'بیمار' }, { k: 'kind', l: 'نوع', v: r => (M1_KIND[r.kind] || r.kind) + (r.kind === 'chq' ? (r.st === 'ok' ? ' (وصول)' : r.st === 'bounce' ? ' (برگشتی)' : ' (در انتظار)') : '') }, { k: 'no', l: 'شماره / بانک', v: r => [r.no, r.bank].filter(Boolean).join(' — ') }, { k: 'amount', l: 'مبلغ', t: 'm' }, { k: 'by', l: 'ثبت' }], d.rcv.rows, { sum: ['amount'], sub, cap: 500 })}</div>`;
  if (M1.sec === 'debt') return `<div class="card"><h3>بدهی بیماران</h3><p class="note">مانده‌ی بیمارانی که درمانشان شروع شده (تا امروز؛ وابسته به بازه نیست).</p>
    ${FT('m1debt', 'بدهی بیماران', [{ k: 'name', l: 'بیمار' }, { k: 'total', l: 'کل درمان', t: 'm' }, { k: 'paid', l: 'پرداخت‌شده', t: 'm' }, { k: 'wait', l: 'چک در انتظار', t: 'm' }, { k: 'rest', l: 'مانده', t: 'm' }], d.debt.rows, { sum: ['total', 'paid', 'wait', 'rest'], sub: 'تا ' + jDay(d.to), cap: 500 })}</div>`;
  if (M1.sec === 'docs') return `<div class="card"><h3>سهم پزشکان و همکاران</h3>${d.docs.arcSkip && d.docs.arcSkip.length ? `<p class="note">خدمت‌های پرونده‌ی کاغذی که در جدول تعرفه‌ی پزشکان نیستند (بی‌سهم؛ با افزودن خدمت هم‌نام و تعرفه در «تعرفه‌ی پزشکان» محاسبه می‌شوند): ${d.docs.arcSkip.map(x => esc(x.k) + " ×" + fa(x.n)).join("، ")}</p>` : ""}${d.docs.unmatched || d.docs.zero ? `<p class="msg err">${d.docs.unmatched ? fa(d.docs.unmatched) + ' خدمت بدون پزشک مشخص' : ''}${d.docs.unmatched && d.docs.zero ? ' · ' : ''}${d.docs.zero ? fa(d.docs.zero) + ' خدمت بدون تعرفه‌ی سهم برای پزشکش' : ''} — در جدول ریز با توضیح مشخص شده‌اند؛ تعرفه‌ها در «حسابداری کامل ← تعرفه‌ی پزشکان».</p>` : ''}
    ${FT('m1docs', 'جمع سهم هر پزشک', [{ k: 'name', l: 'پزشک / همکار' }, { k: 'n', l: 'تعداد خدمت', t: 'n' }, { k: 'fee', l: 'سهم', t: 'm' }], d.docs.by, { sum: ['fee'], sub })}
    ${FT('m1docr', 'ریز خدمات و سهم', [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'pat', l: 'بیمار' }, { k: 'svc', l: 'خدمت' }, { k: 'qty', l: 'تعداد', t: 'n' }, { k: 'amt', l: 'مبلغ خدمت', t: 'm' }, { k: 'doc', l: 'پزشک' }, { k: 'fee', l: 'سهم', t: 'm' }, { k: 'note', l: 'توضیح' }], d.docs.rows, { sum: ['amt', 'fee'], sub, cap: 500, land: 1 })}</div>`;
  return `<div class="card"><h3>هزینه‌ها و سود</h3><div class="kv"><span>دریافتی از بیماران</span><span>${money(d.rcv.total)}</span><span>− سهم پزشکان</span><span>${money(d.docs.total)}</span><span>− هزینه‌ها</span><span>${money(d.exp.total)}</span><span>− بهای ایمپلنت و مواد مصرف‌شده</span><span>${money(d.mat.total)}${d.mat.noCost ? ` <small class="note">(${fa(d.mat.noCost)} قلم بدون قیمت خرید)</small>` : ''}</span><span><b>= سود</b></span><span><b class="${d.profit < 0 ? 'bad' : ''}">${money(d.profit)}</b></span></div>
    ${FT('m1exp', 'هزینه‌ها به تفکیک', [{ k: 'cat', l: 'دسته', v: r => m1Cat(r.cat) }, { k: 'amount', l: 'مبلغ', t: 'm' }], d.exp.by, { sum: ['amount'], sub })}
    ${FT('m1expr', 'ریز هزینه‌ها', [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'cat', l: 'دسته', v: r => m1Cat(r.cat) }, { k: 'note', l: 'شرح' }, { k: 'pay', l: 'پرداخت', v: r => M1_KIND[r.pay] || r.pay }, { k: 'amount', l: 'مبلغ', t: 'm' }, { k: 'by', l: 'ثبت' }], d.exp.rows, { sum: ['amount'], sub, cap: 500 })}
    ${FT('m1mat', 'ایمپلنت و مواد مصرف‌شده', [{ k: 'day', l: 'تاریخ', t: 'd' }, { k: 'item', l: 'قلم' }, { k: 'pat', l: 'بیمار' }, { k: 'n', l: 'تعداد', t: 'n' }, { k: 'cost', l: 'بها', t: 'm' }], d.mat.rows, { sum: ['n', 'cost'], sub, cap: 500 })}</div>` }
function m1Render() { const el = $('m1Root'); if (!el || $('viewM1').hidden) return; el.innerHTML = m1Head() + m1Cards() + m1Sec() }
document.addEventListener('click', e => { const t = e.target && e.target.closest && e.target.closest('[data-m1pre],[data-m1sec],[data-m1go],#m1Go'); if (!t) return;
  if (t.dataset.m1pre) { const k = t.dataset.m1pre; M1.pk = k; if (k !== 'c') { M1.per = i2Range(k); m1Render(); m1Load() } else m1Render(); return }
  if (t.dataset.m1sec) { M1.sec = t.dataset.m1sec; m1Render(); return }
  if (t.dataset.m1go) { M1.more = true; goTile(t.dataset.m1go); return }
  if (t.id === 'm1Go') { const f = parseJ($('m1From').value), o = parseJ($('m1To').value); if (!f || !o || f > o) { toast('تاریخ‌ها را درست بنویسید.', 1); return } M1.per = { from: f, to: o }; M1.pk = 'c'; m1Render(); m1Load() } });
/* ---- inventory for the manager / accountant: only «گزارش‌ها» and the two stock tabs; the report select (duplicate of the side list) and the duplicate reports go ---- */
const M1_IDUP = ['users', 'bysup', 'pers', 'kpi'];
{ const _r = i2RepView; i2RepView = function (B) { const r = _r.apply(this, arguments); try { if (ROLE === 'manager' || ROLE === 'accountant') { const s = B.querySelector('.i2sel'); if (s) s.remove(); M1_IDUP.forEach(k => { const b = B.querySelector(`.i2card[data-i2rep="${k}"]`); if (b) b.remove() }) } } catch (e) {} return r } }
