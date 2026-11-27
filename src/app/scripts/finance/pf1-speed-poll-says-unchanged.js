/* ---------- pf1: speed — (1) a poll that says «unchanged» does not rebuild the screen (at most once a minute, for the waiting-time labels);
   (2) the manager dashboard rebuilds the old data shape from the compact server answer, so renderDash itself is unchanged ---------- */
let PF1_LR = 0;
{ const _a = applyQueue; applyQueue = function (j) { if (j && j.same && !j.items && Date.now() - PF1_LR < 60000) return; PF1_LR = Date.now(); return _a.apply(this, arguments) } }
function pf1Dash(j) {
  if (!j || j.v !== 2) return j; const S = j.S || [], s = i => i < 0 ? undefined : S[i];
  const plans = (j.plans || []).map(r => ({ id: '', st: s(r[0]), c: s(r[1]), d: s(r[2]), t: r[3], b: s(r[4]), doc: s(r[5]), ref: s(r[6]), city: s(r[7]), sn: r[8], ps: s(r[9]), s1: s(r[10]), imp: r[11], diff: r[12], lr: s(r[13]), la: s(r[14]) }));
  const pays = [];
  (j.late || []).forEach(([due, amount, plan]) => pays.push({ plan, kind: 'chq', amount, due, st: 'wait', at: '' }));
  if (j.wait) pays.push({ plan: '', kind: 'chq', amount: j.wait, due: '9999-12-31', st: 'wait', at: '' });
  (j.okd || []).forEach(([c, d, sum]) => pays.push(c ? { plan: '', kind: 'chq', amount: sum, due: d, st: 'ok', at: '' } : { plan: '', kind: 'cash', amount: sum, due: '', st: 'ok', at: d }));
  const labs = (j.labs || []).map(([st, due, name, plan]) => ({ plan, st, due, created: '', upd: '', name }));
  return { ok: true, at: j.at, today: j.today, plans, pays, labs, appts: [], tasks: [] } }
{ const _a = api; api = function (action, payload) { const p = _a.apply(this, arguments); return action === 'stats' ? Promise.resolve(p).then(pf1Dash) : p } }
