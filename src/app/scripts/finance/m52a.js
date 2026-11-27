/* ---------- m52a (owner, 2026-11-18):
   (1) reception «تعیین تکلیف مالی» after the surgery day: the surgery part and the prosthesis part are settled separately («هر دو» is gone,
       the sheet opens on the part that is still open), and the cash discount is «نقد جراحی با ۵٪ تخفیف» — only on the surgery part
       (server action m52SurgDisc: the amount is taken off the patient's account; the plan and the prosthesis part stay as they are);
   (2) a patient whose plan the doctor has opened but not yet sent to the consultant is still «منتظر پزشک» with the waiting time (no «نزد پزشک»);
   (3) the plan doctor's archive says how many plans were sent to the consultant (all / this month / today). ---------- */
/* (1) */
{ const _o = openPostConfirm; openPostConfirm = function (snap) { const r = _o.apply(this, arguments); try { if (PC && snap && PC.id === snap.id) PC.m52r = snap } catch (e) { } return r } }
async function m52Sheet() { if (!PC || !PC._o || !$('pl11Pt')) return; const id = PC.id, j = PL10_GET[id]; if (!j || !((j.surg || {}).sessions || []).length) return;
  const bb = document.querySelector('#pl11Pt [data-pl11pt="b"]'); if (bb) bb.hidden = true;
  if (!$('m52Sep')) $('pl11Pt').insertAdjacentHTML('afterend', '<p class="m52sep" id="m52Sep">بعد از جراحی، پارت جراحی و پارت پروتز جدا تسویه می‌شوند.</p>');
  let inf = null; if (ROLE === 'staff' || ROLE === 'consultant') { try { inf = await api('m52SurgDisc', { id, op: 'info' }, { prio: 'bg', timeout: 12000 }) } catch (e) { inf = null } if (!PC || PC.id !== id) return }
  PC.m52 = inf; const o = PC._o, snap = PC.m52r;
  if (inf && inf.on && !o.m52 && snap) { let S = 0; try { S = chqFor(snap).S || 0 } catch (e) { } o.m52 = 1; o.chq = (o.chq || []).filter(c => c.part !== 's'); o.cashS = Math.max(0, S - (Number(inf.amt) || 0)); o.cash = o.cashS + (o.cashP || 0) }
  const cq = PC.cqParts || {}, sum = p => (o.chq || []).filter(c => c.part === p).reduce((a, c) => a + c.amount, 0), rs = Math.max(0, (o.cashS || 0) - (PC.paidS || 0)) + (cq.s ? 0 : sum('s'));
  pl11Part(rs > 0 ? 's' : 'p'); m52Chips() }
function m52Chips() { const box = $('m50Pm'), inf = PC && PC.m52, snap = PC && PC.m52r; if (!box || !inf || !snap || (snap.pay || {}).m50o) return; const c = box.querySelector('.chips'), n = $('m50PmN'); if (!c) return;
  let own = false; try { own = discOn(snap) } catch (e) { }
  c.innerHTML = `<button type="button" class="chip" data-m52pm="off" aria-pressed="${!inf.on}">طبق طرح مشاور</button><button type="button" class="chip" data-m52pm="on" aria-pressed="${!!inf.on}"${!inf.on && (own || !inf.can) ? ' disabled' : ''}>نقد جراحی با ${fa(inf.pct || 5)}٪ تخفیف</button>`;
  if (n) n.textContent = inf.on ? `پارت جراحی نقد با ${fa(inf.pct || 5)}٪ تخفیف: ${fa(inf.amt)} تومان از حساب بیمار کم شده است. پارت پروتز جدا و طبق طرح مشاور.` : own ? 'طرح مشاور خودش ۱۰۰٪ نقد با تخفیف است.' : inf.can ? `بعد از جراحی تخفیف نقدی فقط روی پارت جراحی است: اگر بیمار جراحی را نقد بدهد ${fa(inf.amt)} تومان کم می‌شود. پارت پروتز جدا و طبق طرح مشاور.` : (inf.why || '') }
{ const _l = pcPrevLoad; pcPrevLoad = async function () { const r = await _l.apply(this, arguments); try { await m52Sheet() } catch (e) { console.error('m52a', e) } return r } }
window.addEventListener('click', async e => { const t = e.target.closest && e.target.closest('[data-m52pm]'); if (!t || !PC || !PC.m52) return; e.preventDefault(); e.stopImmediatePropagation(); if (t.disabled) return;
  const id = PC.id, inf = PC.m52, on = t.dataset.m52pm === 'on'; if (on === !!inf.on) return;
  const y = await uxAsk({ title: on ? 'نقد جراحی با تخفیف' : 'برداشتن تخفیف جراحی', msg: on ? `${fa(inf.pct || 5)}٪ تخفیف فقط روی پارت جراحی: ${fa(inf.amt)} تومان از حساب بیمار کم می‌شود و بیمار باید پارت جراحی را نقد بدهد (بدون چک). پارت پروتز جدا و طبق طرح مشاور می‌ماند.` : `تخفیف ${fa(inf.amt)} تومانی پارت جراحی برداشته می‌شود و به حساب بیمار برمی‌گردد.`, ok: 'ثبت', no: 'انصراف' });
  if (!y) return; t.disabled = true;
  try { await api('m52SurgDisc', { id, op: on ? 'on' : 'off', by: (($('rc_asst') || {}).value || ROLE_LBL[ROLE]) }); toast(on ? 'تخفیف نقدی پارت جراحی ثبت شد.' : 'تخفیف پارت جراحی برداشته شد.');
    try { delete PL10_GET[id] } catch (x) { } const j = await api('get', { id }); openPostConfirm(fromDoc(id, j.data || {})); if (PF && PF.id === id && !$('pfSheet').hidden) refreshFile(); pollQ(true) }
  catch (err) { const m = $('pcMsg'); if (m) { m.className = 'msg err'; m.textContent = err.message } else toast(err.message, 1); t.disabled = false } }, true);
/* (2) */
QLBL.reviewing = ['wait', 'منتظر پزشک'];
{ const _w = waitPill; waitPill = function (x) { return _w.call(this, x && x.queue === 'reviewing' ? Object.assign({}, x, { queue: 'waiting' }) : x) } }
/* (3) */
function m52Cnt() { const L = $('list'); let b = $('m52Cnt'); if (!L || ROLE !== 'doctor' || !listLoaded) { if (b) b.remove(); return }
  const day = at => { const t = Date.parse(at); return isNaN(t) ? '' : new Date(t + 3.5 * 36e5).toISOString().slice(0, 10) }, td = tDay(), jm = jDay(td).slice(0, 7);
  const P = ARCHIVE.filter(d => !d.arc && d.consultAt); let n1 = 0, n2 = 0; P.forEach(d => { const x = day(d.consultAt); if (x === td) n1++; if (x && jDay(x).slice(0, 7) === jm) n2++ });
  if (!b) { L.insertAdjacentHTML('beforebegin', '<div class="m52cnt" id="m52Cnt"></div>'); b = $('m52Cnt') }
  b.innerHTML = `طرح درمان‌های ثبت‌شده (فرستاده‌شده برای مشاور): <b>${fa(P.length)}</b> · این ماه <b>${fa(n2)}</b> · امروز <b>${fa(n1)}</b>` }
{ const _r = renderList; renderList = function () { const r = _r.apply(this, arguments); try { m52Cnt() } catch (e) { } return r } }
