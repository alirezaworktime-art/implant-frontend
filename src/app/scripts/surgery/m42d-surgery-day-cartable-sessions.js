/* ---------- m42d (owner, 2026-11-17): surgery-day cartable — the sessions recorded today are listed with «ویرایش جلسه»; the surgery sheet opens
   filled with what was recorded, and «ثبت جلسه» replaces the session (the server returns the fixtures to the store and recomputes the money). ---------- */
(function(){
const M={edit:null,items:[],t:0,busy:false};
{const _a=api;api=function(action,payload,opt){if(action==='surgSave'&&M.edit&&payload&&payload.id===M.edit.id){action='surgEdit';payload=Object.assign({},payload,{n:M.edit.n})}return _a.call(this,action,payload,opt)}}
function box(){let b=$('m42dBox');if(b)return b;const t=$('qTitle');if(!t)return null;b=document.createElement('section');b.id='m42dBox';b.className='card';b.hidden=true;(t.closest('.qhead')||t).after(b);return b}
function draw(){const b=box();if(!b)return;const on=ROLE==='surgery'&&M.items.length>0;b.hidden=!on;if(!on){b.innerHTML='';return}
  b.innerHTML=`<h3>جلسه‌های ثبت‌شده‌ی امروز</h3><p class="note" style="margin:0 0 4px">اگر چیزی جا افتاده یا اشتباه ثبت شده، تا پایان امروز می‌توانید همان جلسه را ویرایش کنید؛ انبار و مبلغ خودکار اصلاح می‌شود.</p>`+
    M.items.map(i=>`<div class="m42row"><div><span class="nm">${esc(i.name||'')}</span><div class="meta">جلسه‌ی ${fa(i.n)} · ${esc(jt(i.at))}${i.by?' · '+esc(i.by):''}${i.fin?' · پایان جراحی':''}${i.edits?' · '+fa(i.edits)+' بار ویرایش':''}</div></div><button type="button" class="btn sm ghost" data-m42de="${esc(i.id)}" data-n="${i.n}">ویرایش جلسه</button></div>`).join('')}
async function load(force){if(ROLE!=='surgery'){M.items=[];draw();return}if(!force&&Date.now()-M.t<30000){draw();return}M.t=Date.now();try{const r=await api('surgEditList',{},{prio:'bg'});M.items=r.items||[];draw()}catch(e){}}
{const _q=applyQueue;applyQueue=function(){const r=_q.apply(this,arguments);try{if(ROLE==='surgery')load(false)}catch(e){}return r}}
{const _s=show;show=function(v){const r=_s.apply(this,arguments);try{if(v!=='surg'&&M.edit){M.edit=null;const b=$('m42dBan');if(b)b.remove()}if(v==='queue'&&ROLE==='surgery')setTimeout(()=>load(true),400)}catch(e){}return r}}
{const _lo=logout;logout=function(){M.edit=null;M.items=[];M.t=0;const r=_lo.apply(this,arguments);try{draw()}catch(e){}return r}}
async function startEdit(id,n){if(M.busy)return;M.busy=true;try{
  const j=await api('get',{id},{timeout:12000}),sg=j.surg||{},S=sg.sessions||[];
  if(S.length!==n||!S[n-1]){toast('این جلسه دیگر آخرین جلسه‌ی این بیمار نیست؛ ویرایش نمی‌شود.',1);load(true);return}
  const ses=S[n-1],h=(j.data||{}).h||{},today=jalali(new Date()).slash;
  try{localStorage.setItem(SGDK(id),JSON.stringify({d:today,n:n-1,s:ses.s||{},imp:ses.imp||{},asst:ses.asst||'',sa:ses.sa||{},sa2:ses.sa2||{},st:ses.st||{},unc:Number(ses.unc)||3,uncT:true,uc:!!Number(ses.unc),off:['numb','week','suture'].filter(k=>!(ses.fu||[]).includes(k)),by:ses.by||''}))}catch(e){toast('حافظه‌ی این دستگاه پر است؛ ویرایش باز نشد.',1);return}
  try{if(typeof M31K==='function'){if(Array.isArray(ses.oth)&&ses.oth.length)localStorage.setItem(M31K(id),JSON.stringify({d:today,oth:ses.oth}));else localStorage.removeItem(M31K(id))}}catch(e){}
  M.edit={id,n};
  openSurg({id,name:h.name||'',nid:h.nid||'',phone:h.phone||'',age:h.age||'',data:j.data,surg:Object.assign({},sg,{sessions:S.slice(0,-1),finished:false}),photo:j.photo||''});
  if(!SURG||SURG.id!==id){M.edit=null;return}
  try{$('sg_fin').checked=!!sg.finished||j.queue==='surgdone';if($('sg_tmp'))$('sg_tmp').checked=!!Number(ses.tmp)}catch(e){}
  try{$('sgName').textContent=$('sgName').textContent+' · ویرایش';const old=$('m42dBan');if(old)old.remove();const d=document.createElement('div');d.id='m42dBan';d.className='banner info';d.setAttribute('role','status');
    d.textContent='در حال ویرایش جلسه‌ی '+fa(n)+' که امروز ثبت شده است. هر چه لازم است کم و زیاد کنید و «ثبت جلسه» را بزنید؛ ثبت قبلی جایگزین می‌شود و انبار و مبلغ دوباره حساب می‌شود. اگر بدون ثبت بیرون بروید، جلسه‌ی قبلی سر جایش می‌ماند.';
    const v=$('viewSurg');v.insertBefore(d,v.firstChild)}catch(e){}
  try{const t=$('toast');if(t)t.hidden=true}catch(e){}
  }catch(e){toast(e.message,1)}finally{M.busy=false}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m42de]');if(!t)return;e.preventDefault();startEdit(t.dataset.m42de,Number(t.dataset.n))});
try{if(typeof ACT_L==='object')Object.assign(ACT_L,{surgEdit:'ویرایش جلسه‌ی جراحی'})}catch(e){}
try{if(ROLE==='surgery')setTimeout(()=>load(true),1500)}catch(e){}
window.m42d={load,startEdit,state:()=>M};
})();
