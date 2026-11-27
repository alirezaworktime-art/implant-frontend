/* ---------- m56a (owner, 2026-11-18): «سایر کلینیک‌ها» › «انجام کار» — our fee from the clinic (income), never the patient's plan price.
   A clinic may have several services on the implant section (IMP surgery, fixture JD, fixture / surgery of زایگوما، نازال، تریگوئید).
   The implant card is shown once; each of these services gets its own line. Count of a tooth: from the «موارد خاص» rows of the implant card —
   fx_z / sg_z (and _n, _t) count the teeth marked so; fx_jd counts the other implant teeth (when the clinic has the fixture of that kind) and
   IMP counts the other implant teeth (when the clinic has the surgery of that kind). Clinics without such services work as before. ---------- */
const M56_T = ['z', 'n', 't'];
function m56Types(si) { const c = { z: 0, n: 0, t: 0 }; try { const seen = {}; (si && si.sp || []).forEach(r => { if (!r || !r.k || !isTooth(r.k) || !si.sel || !si.sel[r.k] || seen[r.k]) return; const ty = m55Ty(r.b); if (!ty) return; seen[r.k] = 1; if (c[ty] !== undefined) c[ty]++ }) } catch (e) { } return c }
function m56Q(s, x) { const f = OC3.f, st = f && f.s && f.s[x.id], base = oc3Qty(x, st); if (x.id !== 'imp' || !base) return base;
  const svc = (ocCl(OC2.v.pat.clinic).svc || []).filter(v => v.sec === 'imp'), has = k => svc.some(v => v.k === k), T = m56Types(st), m = /^(fx|sg)_([znt])$/.exec(s.k || '');
  if (m) return T[m[2]];
  const pre = s.k === 'fx_jd' ? 'fx_' : 'sg_'; return Math.max(0, base - M56_T.reduce((a, t) => a + (has(pre + t) ? T[t] : 0), 0)) }
/* the implant card once, every service of the section as its own line */
{ const _c = oc3Cards; oc3Cards = function (kind) { const L = _c.apply(this, arguments), seen = {}; return L.filter(s => { if (seen[s.sec]) return false; seen[s.sec] = 1; return true }) } }
const m56All = (kind, sec) => { try { return oc3SvcOf(ocCl(OC2.v.pat.clinic), kind).filter(s => s.sec === sec && SEC[s.sec]) } catch (e) { return [] } };
oc3LineHTML = function (s, x) { const q = m56Q(s, x), p = oc3Price(s); return `<div class="oc3-line" data-oc3l="${esc(s.k)}"><span class="oc3-sn">${esc(s.n)}</span><label class="f oc3-pf">تعرفه (ریال)<input class="price" inputmode="numeric" data-oc3p="${esc(s.k)}" value="${p ? esc(fa(p)) : ''}" placeholder="۰"></label><b class="pl9m" dir="ltr">${fa(q)} × ${fa(p)} = ${fa(q * p)}</b>${!p ? '<i class="oc-warn">تعرفه صفر</i>' : ''}</div>` };
{ const _s = sectionHTML; sectionHTML = function (x) { let h = _s.apply(this, arguments); try { if (OC3.mode && OC3.f && (OC3.mode === 'work' || OC3.mode === 'pros') && x && x.id) { const L = m56All(OC3.mode, x.id); if (L.length > 1) { const i = h.lastIndexOf('</section>'); if (i > 0) h = h.slice(0, i) + L.slice(1).map(s => oc3LineHTML(s, x)).join('') + h.slice(i) } } } catch (e) { } return h } }
oc3Lines = function (kind) { const f = OC3.f, c = ocCl(OC2.v.pat.clinic), out = []; oc3SvcOf(c, kind).forEach(s => { const x = SEC[s.sec]; const q = x ? m56Q(s, x) : (f.q[s.k] || 0); if (q) out.push({ k: s.k, n: s.n, q, p: oc3Price(s), sec: s.sec || '' }) }); return out };
{ const _p = oc3Paint; oc3Paint = function () { const r = _p.apply(this, arguments); try { if (!OC3.f || !(OC3.mode === 'work' || OC3.mode === 'pros')) return r;
  oc3SvcOf(ocCl(OC2.v.pat.clinic), OC3.mode).forEach(s => { const x = SEC[s.sec], el = document.querySelector(`[data-oc3l="${CSS.escape(s.k)}"]`); if (!el || !x) return; const q = m56Q(s, x), p = oc3Price(s); el.querySelector('b.pl9m').textContent = `${fa(q)} × ${fa(p)} = ${fa(q * p)}`; const w = el.querySelector('i.oc-warn'); if (w && p) w.remove() });
  const sm = $('oc3Sum'); if (sm) sm.textContent = ocR(oc3Lines(OC3.mode).reduce((a, l) => a + l.q * l.p, 0)) } catch (e) { console.error('m56a', e) } return r } }
