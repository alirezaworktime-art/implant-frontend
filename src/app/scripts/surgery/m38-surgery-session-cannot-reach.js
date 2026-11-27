/* ---------- m38 (owner, 2026-11-17): (1) a surgery session that cannot reach the server (no internet) is kept on this device and sent by itself when the
   connection is back — same operation id, so it is never recorded twice; (2) a patient left in the surgery cartable from an earlier day is shown to
   reception / surgery with «امروز جراحی نشد» one tap away. ---------- */
(function(){
const K='implantSgQ',NET=/اتصال به سرور برقرار نشد|پاسخ سرور قابل خواندن نبود|Failed to fetch|NetworkError|Load failed|^aborted$/;
let Q=[];try{Q=JSON.parse(localStorage.getItem(K)||'[]')||[]}catch(e){Q=[]}if(!Array.isArray(Q))Q=[];
const save=()=>{try{localStorage.setItem(K,JSON.stringify(Q));return true}catch(e){return false}};
let RUN=false,JUST=null,HIDE='';
const role=()=>{try{return typeof ROLE!=='undefined'&&ROLE||''}catch(e){return ''}};
const tday=t=>new Date((t||Date.now())+3.5*36e5).toISOString().slice(0,10);
const _a=api;
api=async function(action,payload,opt){
  if(action!=='surgSave'||!payload||!payload.id)return _a.apply(this,arguments);
  if(Q.some(o=>o.id===payload.id))throw new Error('یک جلسه‌ی این بیمار روی همین دستگاه منتظر ارسال است؛ اول باید همان ثبت شود.');
  try{if(navigator.onLine===false)throw new Error('اتصال به سرور برقرار نشد');return await _a.call(this,action,payload,opt)}
  catch(e){if(!NET.test((e&&e.message)||''))throw e;
    const o={id:payload.id,name:'',n:(payload.session||{}).n||0,at:Date.now(),role:role(),p:payload};Q.push(o);
    if(!save()){Q=Q.filter(x=>x!==o);throw e}
    JUST=o;throw new Error('اینترنت قطع است؛ جلسه روی این دستگاه نگه داشته شد.')}};
const _c=surgCommit;
surgCommit=async function(t){JUST=null;const id=SURG&&SURG.id,nm=SURG&&SURG.rec&&SURG.rec.h&&SURG.rec.h.name||'';
  await _c.apply(this,arguments);
  if(!JUST)return;const o=JUST;JUST=null;o.name=nm;save();
  try{localStorage.removeItem(SGDK(id))}catch(e){}try{localStorage.removeItem(M31K(id))}catch(e){}
  try{if(SURG)SURG.dirty=false;SGP=null;$('sgRev').hidden=true;$('srMsg').textContent=''}catch(e){}
  try{show('queue')}catch(e){}bar();
  try{toast('اینترنت قطع است. جلسه‌ی جراحی '+nm+' روی این دستگاه نگه داشته شد و با وصل شدن اینترنت خودکار ثبت می‌شود.',true)}catch(e){}};
const _o=openSurg;
openSurg=function(x){if(x&&Q.some(o=>o.id===x.id)){try{alertMsg('جلسه‌ی جراحی این بیمار روی همین دستگاه منتظر ارسال است. تا ثبت نشده، جلسه‌ی تازه باز نمی‌شود.')}catch(e){}return}return _o.apply(this,arguments)};
async function run(force){if(RUN||!Q.length)return bar();RUN=true;bar();
  try{for(const o of Q.slice()){if(o.role&&o.role!==role())continue;if(o.err&&!force)continue;
    try{await _a('surgSave',o.p,{timeout:15000,tries:1,prio:'bg'});Q=Q.filter(x=>x!==o);save();
      try{toast('جلسه‌ی جراحی '+(o.name||'')+' ثبت شد.')}catch(e){}try{pollQ(true)}catch(e){}}
    catch(e){const m=(e&&e.message)||'خطا';if(NET.test(m)){o.tries=(o.tries||0)+1;delete o.err;save();break}o.err=m;save()}}}
  finally{RUN=false;bar()}}
function detail(o){const s=(o.p&&o.p.session)||{},L=[];
  L.push('بیمار: '+(o.name||'—'));L.push('جلسه‌ی '+fa(s.n||0)+' · '+(s.jalali||'')+' · جراح: '+(s.by||'—')+(s.asst?' · دستیار: '+s.asst:''));
  try{const used=SECTIONS.filter(x=>rowUsed({s:s.s||{},brand:'ko',pay:{}},x));if(used.length){L.push('');L.push('کارهای این جلسه:');used.forEach(x=>L.push('• '+x.t+': '+(secDesc(s.s,x)||'—')))}}catch(e){}
  const ks=Object.keys(s.imp||{});if(ks.length){L.push('');L.push('ایمپلنت‌ها:');ks.forEach(k=>{let t=k,d='';try{t=toothTxt([k])}catch(e){}try{d=impTxt(s.imp[k])}catch(e){const m=s.imp[k]||{};d=[m.b,m.d,m.l].filter(Boolean).join(' · ')}L.push('• '+t+' — '+d)})}
  (Array.isArray(s.oth)?s.oth:[]).forEach(x=>L.push('• سایر: '+x.t+(x.amt?' — '+fa(x.amt)+' تومان':'')));
  L.push('');L.push(o.p.finish?'آخرین جلسه (پایان درمان جراحی)':'جراحی ادامه دارد');if(o.err){L.push('');L.push('پاسخ سرور: '+o.err)}return L.join('\n')}
function stuck(){const r=role();if(!['staff','surgery','manager'].includes(r))return [];let L=[];try{L=typeof QITEMS!=='undefined'&&Array.isArray(QITEMS)?QITEMS:[]}catch(e){}
  const td=tday();return L.filter(x=>x&&x.queue==='surgery'&&x.surgAt&&tday(Date.parse(x.surgAt))<td&&!Q.some(o=>o.id===x.id))}
function bar(){let el=document.getElementById('m38Bar');if(!el){el=document.createElement('div');el.id='m38Bar';document.body.appendChild(el)}
  const r=role(),H=[];
  const pend=Q.filter(o=>!o.err),bad=Q.filter(o=>o.err);
  if(pend.length){const mine=pend.every(o=>!o.role||o.role===r);
    H.push(`<div class="m38n" role="status"><span><b>${fa(pend.length)} جلسه‌ی جراحی روی این دستگاه منتظر اینترنت است</b> (${pend.map(o=>esc(o.name||'—')).join('، ')}). ${mine?'با وصل شدن اینترنت خودکار ثبت می‌شود؛ تا آن موقع داده‌های مرورگر این دستگاه را پاک نکنید.':'برای ارسال، روی همین دستگاه با ورود «جراحی» وارد شوید.'}</span>${mine?`<button type="button" class="p" data-m38="go"${RUN?' disabled':''}>${RUN?'در حال ارسال…':'الان ارسال کن'}</button>`:''}<button type="button" data-m38="det" data-i="${Q.indexOf(pend[0])}">جزئیات</button></div>`)}
  bad.forEach(o=>H.push(`<div class="m38n err" role="alert"><span><b>جلسه‌ی جراحی ${esc(o.name||'')} ثبت نشد:</b> ${esc(o.err)}</span><button type="button" data-m38="det" data-i="${Q.indexOf(o)}">جزئیات</button><button type="button" class="p" data-m38="retry" data-i="${Q.indexOf(o)}">دوباره تلاش</button><button type="button" data-m38="del" data-i="${Q.indexOf(o)}">حذف</button></div>`));
  const S=stuck(),sig=S.map(x=>x.id).join(',');
  if(S.length&&sig!==HIDE)S.slice(0,4).forEach((x,i)=>H.push(`<div class="m38n stk"><span><b>${esc(x.name||'')}</b> از ${esc(jalali(new Date(Date.parse(x.surgAt))).slash)} در کارتابل جراحی مانده و جلسه‌ای برایش ثبت نشده است.${S.length>4&&i===3?' (و '+fa(S.length-4)+' بیمار دیگر)':''}</span><button type="button" class="p" data-fx5sc="${esc(x.id)}">امروز جراحی نشد</button>${i===0?'<button type="button" data-m38="later">بعداً</button>':''}</div>`));
  const h=H.join('');if(el._h!==h){el.innerHTML=h;el._h=h}el.hidden=!h;el.dataset.sig=sig;try{document.body.style.setProperty('--m38h',h?Math.min(el.offsetHeight,innerHeight*.6)+'px':'0px')}catch(e){}}
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('[data-m38]');if(!t)return;e.preventDefault();const k=t.dataset.m38,o=Q[Number(t.dataset.i)];
  if(k==='go'){run(true);return}
  if(k==='later'){HIDE=document.getElementById('m38Bar').dataset.sig||'';bar();return}
  if(!o)return;
  if(k==='retry'){delete o.err;save();run(true);return}
  if(k==='det'){const s=fxSheet('m38Det',`<h3>جلسه‌ی جراحیِ ثبت‌نشده</h3><pre id="m38DetT"></pre><div class="btns"><button class="btn ghost" type="button" id="m38DetX" style="flex:1">بستن</button></div>`);$('m38DetT').textContent=detail(o);$('m38DetX').onclick=()=>{s.hidden=true};return}
  if(k==='del'){const ok=await uxConfirm('این جلسه از این دستگاه پاک می‌شود و در پرونده ثبت نمی‌شود. اگر جراحی انجام شده، اول «جزئیات» را ببینید و جلسه را دوباره وارد کنید.','پاک شود',true,'حذف جلسه‌ی ثبت‌نشده');if(!ok)return;Q=Q.filter(x=>x!==o);save();bar()}});
window.addEventListener('online',()=>setTimeout(()=>run(false),1500));
setInterval(()=>{if(Q.some(o=>!o.err))run(false);else bar()},20000);
setTimeout(()=>run(false),4000);
window.m38={q:()=>Q,run,bar};
})();
