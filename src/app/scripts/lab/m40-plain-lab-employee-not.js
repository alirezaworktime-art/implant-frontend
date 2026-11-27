/* ---------- m40 (owner, 2026-11-17): a plain lab employee (not supervisor, not reception) gets a cartable of his own work only: «برای من آمده», «نیمه‌تمام»,
   «تمام‌کرده‌ام». No side menu, no lists of other orders, no search over the lab, no money. The server enforces the same limits. ---------- */
(function(){
const M40={tile:'',done:null,days:30,busy:false,ver:''};
const plain=()=>{try{const me=(typeof L2!=='undefined'&&L2&&L2.me)||null;return typeof ROLE!=='undefined'&&ROLE==='lab'&&!!me&&!!me.id&&me.id!=='shared'&&!me.sup&&!me.recep}catch(e){return false}};
const T={m_new:['برای من آمده','هنوز شروع نکرده‌اید','lapis'],m_do:['نیمه‌تمام','شروع کرده‌اید و تمام نشده','accent'],m_done:['تمام‌کرده‌ام','','ok']};
async function load(days){if(M40.busy)return;M40.busy=true;try{const j=await api('lab5',{op:'m40mine',days});M40.done=j.items||[];M40.days=days;M40.err=''}catch(e){M40.err=(e&&e.message)||'خطا';if(!M40.done)M40.done=[]}finally{M40.busy=false;try{if(L5.sec==='bench')renderLab()}catch(e){}}}
function doneCard(x){const id=l6Esc(x.lid);let cross='';try{cross=x.teeth&&x.teeth.length?l6Cross(x.teeth):''}catch(e){}
  return `<article class="m40d"><b class="m36no tnum">#${l2No(x.no)}</b><div class="m40m"><b>${l6Esc(x.name||'')}</b><span class="meta">${l6Esc(x.dname||'')}${x.part?' ('+l6Esc(x.part)+')':''} · پایان: ${l6Esc(jDay(String(x.at||'').slice(0,10))||'—')}${x.wt?' · '+l6Esc(x.wt):''}</span></div>${cross}<span class="pill ${x.st==='done'?'ok':x.st==='cancel'||x.del?'bad':'wait'}">${x.del?'حذف‌شده':x.st==='done'?'تحویل شده':x.st==='cancel'?'لغو شده':x.st==='ready'?'آماده‌ی خروج':'در لابراتوار'}</span><button type="button" class="btn ghost" data-l4open="${id}">برگه و فایل‌ها</button></article>`}
const _b=l6BenchHTML;
l6BenchHTML=function(){if(!plain())return _b.apply(this,arguments);
  const R=m36Rows().filter(M36_F.mine),me=L2.me||{},n={m_new:R.filter(M36_F.m_new).length,m_do:R.filter(M36_F.m_do).length,m_done:M40.done?M40.done.length:null};
  if(M40.done===null&&!M40.busy)setTimeout(()=>load(30),0);
  const tile=T[M40.tile]?M40.tile:(n.m_new?'m_new':n.m_do?'m_do':'m_new');
  const q=toEn(String(M36.q||'').trim()).toLowerCase(),hit=(no,name)=>toEn([l2No(no),no,name].join(' ')).toLowerCase().includes(q);
  const tiles=Object.keys(T).map(k=>{const[l,s,c]=T[k],on=tile===k,sub=k==='m_done'?(M40.days?fa(M40.days)+' روز اخیر':'همه'):s;return `<button type="button" class="m36tile m36c-${c}${on?' on':''}" data-m40tile="${k}" aria-pressed="${on}"><span class="m36n">${n[k]===null?'…':fa(n[k])}</span><span class="m36l">${l}</span><span class="m36s">${sub}</span></button>`}).join('');
  let body='',cnt=0;
  if(tile==='m_done'){const D=(M40.done||[]).filter(x=>!q||hit(x.no,x.name));cnt=D.length;
    body=(M40.err?`<div class="qwarn">${l6Esc(M40.err)}</div>`:'')+(D.slice(0,400).map(doneCard).join('')||`<div class="empty m36empty">${M40.done===null||M40.busy?'در حال خواندن…':'در این بازه کاری را تمام نکرده‌اید.'}</div>`)+(M40.days?`<div class="m40more"><button type="button" class="btn ghost" data-m40old="1"${M40.busy?' disabled':''}>نمایش قدیمی‌ترها</button></div>`:'')}
  else{const P=R.filter(M36_F[tile]).filter(r=>!q||hit(r.x.no,r.x.name));cnt=P.length;body=P.slice(0,200).map(m36Card).join('')||`<div class="empty m36empty">${tile==='m_new'?'کار تازه‌ای به شما ارجاع نشده است.':'کار نیمه‌تمامی ندارید.'}</div>`}
  const late=R.filter(M36_F.m_late).length;
  return `<div class="m36"><div class="m36top"><div><h2 class="m36h">کارهای من</h2><div class="meta">${l6Esc(me.name||'')} · فقط کارهایی که به شما ارجاع شده${late?` · <b style="color:var(--bad)">${fa(late)} کار از مهلت گذشته</b>`:''}</div></div>
    <div class="m36tools"><input id="m36q" value="${l6Esc(M36.q||'')}" placeholder="جست‌وجو در کارهای من: شماره یا نام بیمار" aria-label="جست‌وجو در کارهای من"></div></div>
    <div class="m36tiles">${tiles}</div><h3 class="m36sec">${l6Esc(q?'نتیجه‌ی جست‌وجو در «'+T[tile][0]+'»':T[tile][0])} <span class="meta">— ${fa(cnt)} کار</span></h3>${body}</div>`};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m40tile],[data-m40old]');if(!t)return;
  if(t.dataset.m40old){load(0);return}
  M40.tile=t.dataset.m40tile;M36.q='';if(M40.tile==='m_done')load(M40.days);else renderLab()});
/* stay on the workbench; hide what is not his */
const _g=l5Go;l5Go=function(k){if(plain()&&k!=='bench')k='bench';return _g.call(this,k)};
const _r=renderLab;renderLab=function(){let p=false;try{p=plain();document.body.classList.toggle('m40plain',p);if(p&&L5.sec!=='bench')L5.sec='bench'}catch(e){}
  try{if(p){const v=String((typeof LB!=='undefined'&&LB&&LB.ver)||'');if(M40.ver&&v!==M40.ver&&M40.done!==null&&!M40.busy)setTimeout(()=>load(M40.days),0);M40.ver=v}else if(M40.done){M40.done=null;M40.tile=''}}catch(e){}
  return _r.apply(this,arguments)};
window.m40={plain,state:M40};
})();
