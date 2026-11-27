/* ---------- m20 (owner, 2026-11-12) «تعامل لابراتوار و پزشک»: (1) the lab can open a case too — «ثبت ایراد برای پزشک» (own list of issue kinds; the case starts at «منتظر پاسخ پزشک»); (2) third login, user «Nazer» = ناظر: every case (read only) + (3) the report «گزارش ایرادها»: how many patients of which clinic, in which dates, by kind of issue — also for the manager; Excel output. ---------- */
LF_ROLES.lfnazer = 1; Object.assign(ROLE_LBL, { lfnazer: 'ناظر — تعامل لابراتوار و پزشک' }); LF_WHO.lfnazer = 'ناظر';
Object.assign(LF_SEGT, { rep: 'از لابراتوار — منتظر پاسخ شما', rpt: 'گزارش ایرادها', new2: 'ثبت ایراد برای پزشک' });
const M20U = { doctor: 'lfdoc', lab: 'lflab', nazer: 'lfnazer' };
try { $('lf_user').placeholder = 'doctor، lab یا Nazer' } catch (e) { }
lfLogin = async function () { const m = $('lgMsg'), u = $('lf_user').value.trim().toLowerCase(), pw = $('lg_pw').value;
  if (!M20U[u]) { m.className = 'msg err'; m.textContent = 'نام کاربری را درست بنویسید (doctor، lab یا Nazer).'; $('lf_user').focus(); return }
  if (!pw) { m.className = 'msg err'; m.textContent = 'رمز عبور را بنویسید.'; $('lg_pw').focus(); return }
  m.className = 'msg'; m.textContent = 'در حال ورود…'; API.pw = 'lf|' + u + '|' + pw;
  try { const j = await api('ping'); if (j.role !== M20U[u]) { API.pw = ''; saveApi(); m.className = 'msg err'; m.textContent = 'نام کاربری یا رمز عبور اشتباه است.'; return }
    pwRemember('lf', pw); try { localStorage.setItem('implantLfU', u) } catch (e) { } LF.d = null; LF.open = ''; enter(j) }
  catch (e) { API.pw = ''; saveApi(); LROLE = 'lf'; lfLgUi(); m.className = 'msg err'; m.textContent = /رمز عبور اشتباه/.test(e.message) ? 'نام کاربری یا رمز عبور اشتباه است.' : e.message } };
/* tiles */
{ const _l = TILES.lflab; TILES.lflab = () => { const L = _l(); L.splice(1, 0, { k: 'lfnew2', c: 'chk', l: 'ثبت ایراد برای پزشک', s: 'قالب، اسکن یا دستور کار مشکل دارد', n: 0, lseg: 'new' }); return L } }
{ const _d = TILES.lfdoc; TILES.lfdoc = () => _d().map(t => t.k === 'lfrep' ? Object.assign({}, t, { l: 'از لابراتوار — منتظر شما', s: 'پاسخ‌ها و ایرادهای لابراتوار' }) : t) }
TILES.lfnazer = () => { const C = lfCases(); return [{ k: 'lfrpt', c: 'cons', l: 'گزارش ایرادها', s: 'تعداد بیمار هر کلینیک به تفکیک تاریخ و نوع ایراد', n: 0, lseg: 'rpt' }, { k: 'lfall', c: 'arch', l: 'همه‌ی پرونده‌ها', s: 'جستجو و خروجی اکسل (فقط دیدن)', n: C.length, lseg: 'all' }] };
try { const _t = TILES.manager; TILES.manager = () => _t().concat([{ k: 'lfmr', c: 'cons', l: 'گزارش ایرادهای لابراتوار', s: 'تعداد بیمار هر کلینیک به تفکیک نوع ایراد', n: 0, lseg: 'rpt' }]) } catch (e) { }
/* lab: the new-case form */
{ const _f = lfFormHTML; lfFormHTML = function () { if (ROLE !== 'lflab') return _f.apply(this, arguments); const ls = lfL(), keep = ls.issues; let h = ''; try { ls.issues = ls.labIssues || []; h = _f.apply(this, arguments) } finally { ls.issues = keep }
  return h.replace('<h2>ثبت مشکل تازه</h2>', '<h2>ثبت ایراد برای پزشک</h2>').replace(/<label class="pwshow"><input type="checkbox" id="lfShip"[^>]*>[^<]*<\/label>/, '').replace('>ارسال به لابراتوار</button>', '>ارسال به پزشک</button>').replace('<span>نوع ایراد</span>', '<span>نوع ایراد (از دید لابراتوار)</span>') } }
{ const _s = lfSendNew; lfSendNew = async function (btn) { if (ROLE !== 'lflab') return _s.apply(this, arguments); const f = LF.f, m = $('lfFMsg'), bad = t => { m.className = 'msg err'; m.textContent = t };
  if (!f.clinic) return bad('کلینیک را انتخاب کنید.'); if (!f.patient.trim()) return bad('نام بیمار را بنویسید.'); if (!f.part) return bad('نوع کار را انتخاب کنید.'); if (!f.issue) return bad('نوع ایراد را انتخاب کنید.');
  if (!f.teeth.length) return bad('دست‌کم یک دندان را انتخاب کنید.'); if (!f.desc.trim()) return bad('توضیح ایراد را بنویسید.');
  btn.disabled = true; m.className = 'msg'; m.textContent = f.images.length ? 'در حال ارسال عکس‌ها…' : 'در حال ارسال…';
  try { const r = await api('lf', Object.assign({ op: 'new' }, f, { ship: false })); LF.f = lfBlank(); toast(`پرونده‌ی ${fa(r.no)} برای پزشک فرستاده شد.`); await lfLoad(); goTile('lfdoc') }
  catch (err) { bad(err.message) } finally { if (btn.isConnected) btn.disabled = false } } }
/* who opened the case: list, case, Excel */
{ const _r = lfRow; lfRow = function (c) { let h = _r.apply(this, arguments); if (c && c.from === 'lab') h = h.replace('<i class="lft s-', '<i class="lft fl">از لابراتوار</i><i class="lft s-'); return h } }
{ const _d = lfDetailHTML; lfDetailHTML = function (c) { let h = _d.apply(this, arguments); if (c) h = h.replace('<dl class="lfinfo">', '<dl class="lfinfo"><div><dt>ثبت‌کننده</dt><dd>' + (c.from === 'lab' ? 'لابراتوار (ایراد از کار پزشک)' : 'پزشک (ایراد از کار لابراتوار)') + '</dd></div>'); return h } }
{ const _x = lfXl; lfXl = function () { const L = lfSegList(); const head = ['شماره', 'ثبت‌کننده', 'تاریخ ثبت', 'کلینیک', 'بیمار', 'نوع کار', 'نوع ایراد', 'پایه', 'پونتیک', 'اولویت', 'وضعیت', 'علت اصلی', 'شرح علت (سایر)', 'نتیجه', 'تأیید پزشک', 'آخرین تغییر', 'توضیح'];
  const rows = L.map(c => { const pt = c.pt || {}, T = c.teeth || []; return [c.no, c.from === 'lab' ? 'لابراتوار' : 'پزشک', jt(c.at), c.clinic, c.patient, c.part, c.issue, T.filter(t => pt[t] !== 'p').join('، '), T.filter(t => pt[t] === 'p').join('، '), c.pri === 'urgent' ? 'فوری' : 'عادی', LF_ST[c.st] || '', c.cause || '', c.causeTxt || '', c.outcome || '', c.verdict === 'ok' ? 'بله' : '', jt(c.upd), c.desc || ''] });
  xlsx([{ title: 'تعامل لابراتوار و پزشک', sub: 'تهیه‌شده ' + jt(new Date().toISOString()), head, rows }], 'lab-feedback-' + tDay() + '.xlsx') } }
/* ===== report ===== */
LF.r = { from: '', to: '', cl: '', dir: '', p: 'all' };
const m20Day = iso => { try { return new Date(Date.parse(iso) + 3.5 * 3600e3).toISOString().slice(0, 10) } catch (e) { return '' } };
const m20Key = c => String(c.clinic || '') + '|' + toEn(String(c.patient || '')).replace(/\s+/g, ' ').trim();
function m20Cases() { const r = LF.r; return lfCases().filter(c => { const d = m20Day(c.at); return (!r.from || d >= r.from) && (!r.to || d <= r.to) && (!r.cl || c.clinic === r.cl) && (!r.dir || (r.dir === 'lab' ? c.from === 'lab' : c.from !== 'lab')) }) }
function m20Data() { const L = m20Cases(), cl = [...new Set(L.map(c => c.clinic || '—'))].sort(), tot = {}, M = {}; const U = (o, k, v) => (o[k] = o[k] || new Set()).add(v);
  L.forEach(c => { const k = c.clinic || '—', i = c.issue || '—'; M[k] = M[k] || {}; U(M[k], i, m20Key(c)); U(M[k], '*', m20Key(c)); U(tot, i, m20Key(c)); U(tot, '*', m20Key(c)) });
  const iss = Object.keys(tot).filter(k => k !== '*').sort((a, b) => tot[b].size - tot[a].size || a.localeCompare(b));
  const days = [...new Set(L.map(c => m20Day(c.at)))].sort(), span = days.length ? (Date.parse(days[days.length - 1]) - Date.parse(days[0])) / 864e5 : 0, byMonth = span > 45, G = {}, gk = d => byMonth ? jDay(d).slice(0, 7) : d;
  L.forEach(c => { const g = gk(m20Day(c.at)); G[g] = G[g] || {}; U(G[g], c.clinic || '—', m20Key(c)); U(G[g], '*', m20Key(c)) });
  return { L, cl, iss, M, tot, G, gs: Object.keys(G).sort(), byMonth } }
function m20Tables(D) { const n = s => s ? s.size : 0;
  const t1 = { head: ['کلینیک', ...D.iss, 'جمع بیمار'], rows: D.cl.map(k => [k, ...D.iss.map(i => n(D.M[k][i])), n(D.M[k]['*'])]).concat([['جمع', ...D.iss.map(i => n(D.tot[i])), n(D.tot['*'])]]) };
  const t2 = { head: [D.byMonth ? 'ماه' : 'تاریخ', ...D.cl, 'جمع بیمار'], rows: D.gs.map(g => [D.byMonth ? g : jDay(g), ...D.cl.map(k => n(D.G[g][k])), n(D.G[g]['*'])]) };
  return { t1, t2 } }
function m20ReportHTML() { const r = LF.r, D = m20Data(), T = m20Tables(D), ls = lfL(), tb = (t, lastRowBold) => `<div class="m20w"><table class="m20t"><thead><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((R, ri) => `<tr${lastRowBold && ri === t.rows.length - 1 ? ' class="m20s"' : ''}>${R.map((v, i) => i ? `<td>${v ? fa(v) : '—'}</td>` : `<th>${esc(faD(String(v)))}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const P = [['all', 'همه'], ['today', 'امروز'], ['7', '۷ روز اخیر'], ['30', '۳۰ روز اخیر'], ['month', 'این ماه']];
  return `<div class="card lfcard"><div class="lfhd"><h2>گزارش ایرادها</h2><small>تعداد بیمار (هر بیمار در هر کلینیک یک بار)</small></div>
   <div class="chips" role="group" aria-label="بازه">${P.map(([k, l]) => `<button class="chip" type="button" data-m20p="${k}" aria-pressed="${r.p === k}">${l}</button>`).join('')}</div>
   <div class="fields lff"><label class="f">از تاریخ<input id="m20From" class="ltr" inputmode="numeric" placeholder="۱۴۰۵/۰۸/۰۱" value="${r.from ? esc(jDay(r.from)) : ''}" autocomplete="off"></label><label class="f">تا تاریخ<input id="m20To" class="ltr" inputmode="numeric" placeholder="۱۴۰۵/۰۸/۳۰" value="${r.to ? esc(jDay(r.to)) : ''}" autocomplete="off"></label>
    <label class="f">کلینیک<select id="m20Cl">${lfOpt(ls.clinics, r.cl, 'همه')}</select></label><label class="f">ثبت‌کننده<select id="m20Dir"><option value="">همه</option><option value="doc"${r.dir === 'doc' ? ' selected' : ''}>پزشک (ایراد کار لابراتوار)</option><option value="lab"${r.dir === 'lab' ? ' selected' : ''}>لابراتوار (ایراد کار پزشک)</option></select></label></div>
   <div class="msg" id="m20Msg"></div>
   <div class="lfkp"><span><b>${fa(D.tot['*'] ? D.tot['*'].size : 0)}</b>بیمار</span><span><b>${fa(D.L.length)}</b>پرونده</span><span><b>${fa(D.cl.length)}</b>کلینیک</span><span><b>${fa(D.L.filter(c => c.st !== 'closed').length)}</b>باز</span></div>
   ${D.L.length ? `<h3>کلینیک × نوع ایراد</h3>${tb(T.t1, true)}<h3>${D.byMonth ? 'ماه' : 'تاریخ'} × کلینیک</h3>${tb(T.t2)}<div class="btns"><button class="btn sm ghost" type="button" id="m20Xl">خروجی اکسل گزارش</button></div>` : '<p class="empty">در این بازه پرونده‌ای نیست.</p>'}</div>` }
function m20Xl() { const D = m20Data(), T = m20Tables(D), r = LF.r, sub = (r.from || r.to ? 'از ' + (r.from ? jDay(r.from) : 'ابتدا') + ' تا ' + (r.to ? jDay(r.to) : 'امروز') : 'همه‌ی تاریخ‌ها') + (r.cl ? ' · ' + r.cl : '') + (r.dir ? ' · ثبت‌کننده: ' + (r.dir === 'lab' ? 'لابراتوار' : 'پزشک') : '');
  xlsx([{ title: 'تعداد بیمار — کلینیک × نوع ایراد', sub, head: T.t1.head, rows: T.t1.rows }, { title: 'تعداد بیمار — ' + (D.byMonth ? 'ماه' : 'تاریخ') + ' × کلینیک', sub, head: T.t2.head, rows: T.t2.rows },
    { title: 'پرونده‌ها', sub, head: ['شماره', 'تاریخ ثبت', 'ثبت‌کننده', 'کلینیک', 'بیمار', 'نوع کار', 'نوع ایراد', 'وضعیت', 'علت اصلی', 'نتیجه'], rows: D.L.map(c => [c.no, jDay(m20Day(c.at)), c.from === 'lab' ? 'لابراتوار' : 'پزشک', c.clinic, c.patient, c.part, c.issue, LF_ST[c.st] || '', c.cause || '', c.outcome || '']) }], 'lab-feedback-report-' + tDay() + '.xlsx') }
{ const _r = lfRender; lfRender = function (soft) { const el = $('lfRoot');
  if (el && !$('viewLf').hidden && LF.d && !LF.open) {
    if (LF.seg === 'new' && ROLE === 'lflab') { if (soft) return; el.innerHTML = lfFormHTML(); lfTeethPaint(); return }
    if (LF.seg === 'rpt') { if (soft) { const a = document.activeElement; if (a && el.contains(a) && /INPUT|SELECT/.test(a.tagName)) return } el.innerHTML = m20ReportHTML(); return } }
  return _r.apply(this, arguments) } }
document.addEventListener('click', e => { const root = $('lfRoot'); if (!root || !root.contains(e.target)) return; const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.m20p) { const r = LF.r, td = tDay(), back = n => new Date(Date.parse(td) - n * 864e5).toISOString().slice(0, 10); r.p = t.dataset.m20p;
    if (r.p === 'all') { r.from = ''; r.to = '' } else if (r.p === 'today') { r.from = r.to = td } else if (r.p === 'month') { r.from = parseJ(jDay(td).slice(0, 8) + '01') || ''; r.to = td } else { r.from = back(Number(r.p) - 1); r.to = td } lfRender(); return }
  if (t.id === 'm20Xl') { try { m20Xl() } catch (err) { toast(err.message, 1) } return } });
document.addEventListener('change', e => { const t = e.target; if (!t || !t.id) return;
  if (t.id === 'm20From' || t.id === 'm20To') { const k = t.id === 'm20From' ? 'from' : 'to', v = t.value.trim(), d = v ? parseJ(v) : ''; if (v && !d) { const m = $('m20Msg'); if (m) { m.className = 'msg err'; m.textContent = 'تاریخ را درست بنویسید (مثل ۱۴۰۵/۰۸/۰۱).' } return } LF.r[k] = d || ''; LF.r.p = ''; if (LF.r.from && LF.r.to && LF.r.from > LF.r.to) { const m = $('m20Msg'); if (m) { m.className = 'msg err'; m.textContent = 'تاریخ «از» بعد از «تا» است.' } return } lfRender(); return }
  if (t.id === 'm20Cl') { LF.r.cl = t.value; lfRender(); return } if (t.id === 'm20Dir') { LF.r.dir = t.value; lfRender(); return } });
/* manager: the observer's password beside the other two */
(function () { const d = document.querySelector('.lfpw'); if (!d) return; d.insertAdjacentHTML('beforeend', '<div class="fields"><label class="f">رمز تازه‌ی تعامل لابراتوار و پزشک — نام کاربری Nazer (ناظر؛ حداقل ۴ حرف)<input id="ua_lfnazer" type="password" autocomplete="new-password"></label></div><div class="btns"><button class="btn" type="button" data-lfpwset="nazer" data-rpin2="ua_lfnazer">ثبت رمز تازه‌ی Nazer</button></div>') })();
/* a reload while signed in as the observer */
if (ROLE === 'lfnazer') { try { applyRole(); home() } catch (e) { } }
