/* ---------- fix7c: prosthesis and lab flow — order purposes by path (W9) incl. «پروتز موقت» (A2), doctor's name for clinical decisions by reception / consultant (R6),
   confirmation for a delivery with no lab order (R7) ---------- */
const F7C_L={tryin:'رزین پیچ‌شونده',rabt:'رزین اباتمنت',deliv:'کار نهایی',abut:'اباتمنت',frame:'فریم (برای تست)',bite:'موم و بایت',jig:'جیگ (برای تست)',tmp:'پروتز موقت'};
const F7C_FOR={fix:['tryin','rabt','deliv','abut'],tmp1:['tryin','rabt','deliv','abut'],aox:['frame','tryin','deliv'],ovd:['bite','tryin','deliv']};
['tmp','frame','bite','jig'].forEach(k=>{if(!LFOR[k])LFOR[k]=F7C_L[k]});LFOR_DEF.tmpx='tmp';
function f7cAllowed(j){const pr=(j&&j.pros)||{};if(!pr.stage)return ['tryin','rabt','deliv','abut'];const t=pr2T(pr),a=(F7C_FOR[t]||F7C_FOR.fix).slice();return pr.stage==='tmpx'?['tmp']:pr.stage==='tmpd'?['tmp'].concat(a):a}
function f7cLF(fn){return function(j){const keep=Object.assign({},LFOR),al=f7cAllowed(j);try{Object.keys(LFOR).forEach(k=>delete LFOR[k]);al.forEach(k=>{LFOR[k]=keep[k]||F7C_L[k]||k});return fn.apply(this,arguments)}finally{Object.keys(LFOR).forEach(k=>delete LFOR[k]);Object.assign(LFOR,keep)}}}
h9HTML=f7cLF(h9HTML);loForm=f7cLF(loForm);
{const _i=loInit;loInit=function(j){const r=_i.apply(this,arguments);try{const al=f7cAllowed(j);if(LO&&al.length===1)LO.for=al[0];else if(LO&&LO.for&&!al.includes(LO.for))LO.for=''}catch(e){}return r}}
function f7cDocs(){const n=v=>String(v||'').replace('سید مجتبی ','').trim();return [PROSDOC(),SURGEON(),...ASSTS(),...docList()].filter((v,i,a)=>v&&a.findIndex(x=>n(x)===n(v))===i)}
function f7cDocPick(){return new Promise(res=>{const docs=f7cDocs();let pick='';
  const s=fxSheet('f7cDocSheet',`<h3>کدام پزشک این تصمیم را گرفت؟</h3><p class="note">«تأیید»، «اصلاح» و «شکست ایمپلنت» با ورود منشی یا مشاور فقط با نام پزشک ثبت می‌شود.</p><div class="chips">${docs.map(d=>`<button type="button" class="chip" data-f7cd="${esc(d)}" aria-pressed="false">${esc(d)}</button>`).join('')}</div><label class="f">پزشک دیگر<input id="f7cDocOther" placeholder="نام پزشک" autocomplete="off"></label><div class="msg" id="f7cDocMsg"></div><div class="btns"><button class="btn" type="button" id="f7cDocGo" style="flex:1">ثبت</button><button class="btn ghost" type="button" id="f7cDocNo">انصراف</button></div>`);
  let over=false;const done=v=>{if(over)return;over=true;s.hidden=true;res(v)};
  s.querySelectorAll('[data-f7cd]').forEach(b=>b.onclick=()=>{pick=b.dataset.f7cd;s.querySelectorAll('[data-f7cd]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('f7cDocOther').value=''});
  $('f7cDocGo').onclick=()=>{const v=($('f7cDocOther').value||'').trim()||pick;if(v.length<2){const m=$('f7cDocMsg');m.className='msg err';m.textContent='نام پزشک را انتخاب کنید.';return}done(v)};
  $('f7cDocNo').onclick=()=>done('');s.addEventListener('click',e=>{if(e.target===s)done('')});
  new MutationObserver((ms,ob)=>{if(s.hidden){ob.disconnect();done('')}}).observe(s,{attributes:true,attributeFilter:['hidden']})})}
function f7cNoLab(msg){return new Promise(res=>{const s=fxSheet('f7cNoLabSheet',`<h3>⚠ سفارش لابراتوار ثبت نشده</h3><p>${esc(msg)}</p><div class="btns"><button class="btn" type="button" id="f7cNlGo" style="flex:1">بله، تحویل شد</button><button class="btn ghost" type="button" id="f7cNlNo">انصراف</button></div>`);
  let over=false;const done=v=>{if(over)return;over=true;s.hidden=true;res(v)};$('f7cNlGo').onclick=()=>done(true);$('f7cNlNo').onclick=()=>done(false);
  new MutationObserver((ms,ob)=>{if(s.hidden){ob.disconnect();done(false)}}).observe(s,{attributes:true,attributeFilter:['hidden']})})}
{const _a=api;api=async function(action,payload={},opt={}){
  if(action==='prosAct'&&['staff','consultant'].includes(ROLE)&&payload&&['ok','redo','fail'].includes(payload.op)&&!payload.doc){let d=f7cDocs().includes(payload.by)?payload.by:'';if(!d)d=await f7cDocPick();if(!d)throw new Error('ثبت نشد؛ نام پزشک انتخاب نشد.');payload=Object.assign({},payload,{doc:d})}
  try{return await _a(action,payload,opt)}catch(e){const m=/^F7NOLAB\|([\s\S]*)$/.exec((e&&e.message)||'');if(!m)throw e;
    if(!(await f7cNoLab(m[1])))throw new Error('تحویل ثبت نشد.');return await _a(action,Object.assign({},payload||{},{noLabAck:1}),opt)}}}

