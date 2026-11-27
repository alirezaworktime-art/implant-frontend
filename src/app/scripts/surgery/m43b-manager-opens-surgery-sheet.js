/* ---------- m43b (owner, 2026-11-17): the manager opens the surgery sheet of a recorded session from the patient file («اصلاح جلسه‌ی جراحی») on any
   later day. What was recorded is replaced; the store and the surgery amount follow. Follow-ups, appointments and the «last session» mark stay. ---------- */
(function(){
const MM={edit:null,busy:false};
{const _a=api;api=function(action,payload,opt){if(action==='surgSave'&&MM.edit&&payload&&payload.id===MM.edit.id){const E=MM.edit;let actual=payload.actual;
    /* the recorded amount moves only by what the correction changes (the same sessions priced before and after, in this browser) */
    try{const f=L=>{const a0=surgActual(SURG.rec,L);return (typeof discOn==='function'&&discOn(SURG.rec))?a0-discAmt(SURG.rec,a0):a0},nw=f(SURG.prev.concat([payload.session],E.after)),od=f(SURG.prev.concat([E.old],E.after));
      actual=Number.isFinite(E.recorded)?Math.max(0,E.recorded+nw-od):nw}catch(e){console.error('m43b actual',e)}
    const p=_a.call(this,'surgFix',{id:payload.id,n:E.n,session:payload.session,actual,sendId:payload.sendId},opt);
    Promise.resolve(p).then(()=>{setTimeout(()=>{try{home();openFile(E.id,E.name)}catch(e){}},500)}).catch(()=>{});return p}
  return _a.call(this,action,payload,opt)}}
{const _s=show;show=function(v){const r=_s.apply(this,arguments);try{if(v!=='surg'&&MM.edit){MM.edit=null;const b=$('m43bBan');if(b)b.remove();const f=$('sg_fin');if(f)f.disabled=false;document.querySelectorAll('[data-fu]').forEach(c=>{c.disabled=false})}}catch(e){}return r}}
{const _lo=logout;logout=function(){MM.edit=null;return _lo.apply(this,arguments)}}
/* the button in the patient file */
{const _r=renderFile;renderFile=function(){const out=_r.apply(this,arguments);try{if(ROLE==='manager'&&PF&&PF.j){const S=((PF.j.surg||{}).sessions)||[],a=$('pfActs');
    if(S.length&&!(PF.j.surg||{}).arc&&a&&!a.querySelector('[data-m43bfix]')){const c=a.querySelector('#pfClose'),h=`<button class="btn sm ghost" type="button" data-m43bfix="${esc(PF.id)}">اصلاح جلسه‌ی جراحی</button>`;if(c)c.insertAdjacentHTML('beforebegin',h);else a.insertAdjacentHTML('beforeend',h)}}}catch(e){console.error('m43b btn',e)}return out}}
async function pick(id){if(MM.busy)return;MM.busy=true;try{
  const j=await api('get',{id},{timeout:12000}),sg=j.surg||{},S=sg.sessions||[];if(!S.length){toast('برای این بیمار جلسه‌ی جراحی ثبت نشده است.',1);return}
  let n=S.length;if(S.length>1){const v=await uxAsk({title:'اصلاح کدام جلسه؟',msg:'جلسه‌ای را که باید اصلاح شود انتخاب کنید.',ok:'باز کردن برگه',fields:[{k:'n',l:'جلسه',type:'select',v:String(S.length),opts:S.map((s,i)=>[String(i+1),'جلسه‌ی '+fa(i+1)+' · '+(s.jalali||'')+(s.by?' · '+s.by:'')])}]});if(!v)return;n=Number(v.n)||S.length}
  const ses=S[n-1],h=(j.data||{}).h||{},today=jalali(new Date()).slash;
  try{localStorage.setItem(SGDK(id),JSON.stringify({d:today,n:n-1,s:ses.s||{},imp:ses.imp||{},asst:ses.asst||'',sa:ses.sa||{},sa2:ses.sa2||{},st:ses.st||{},unc:Number(ses.unc)||3,uncT:true,uc:!!Number(ses.unc),off:['numb','week','suture'].filter(k=>!(ses.fu||[]).includes(k)),by:ses.by||''}))}catch(e){toast('حافظه‌ی این دستگاه پر است؛ برگه باز نشد.',1);return}
  try{if(typeof M31K==='function'){if(Array.isArray(ses.oth)&&ses.oth.length)localStorage.setItem(M31K(id),JSON.stringify({d:today,oth:ses.oth}));else localStorage.removeItem(M31K(id))}}catch(e){}
  try{$('pfSheet').hidden=true}catch(e){}
  MM.edit={id,n,name:h.name||'',after:S.slice(n),old:ses,recorded:sg.actual==null||sg.actual===''?NaN:Number(sg.actual)};
  openSurg({id,name:h.name||'',nid:h.nid||'',phone:h.phone||'',age:h.age||'',data:j.data,surg:Object.assign({},sg,{sessions:S.slice(0,n-1),finished:false}),photo:j.photo||''});
  if(!SURG||SURG.id!==id){MM.edit=null;return}
  try{const f=$('sg_fin');f.checked=false;f.disabled=true;document.querySelectorAll('[data-fu]').forEach(c=>{c.disabled=true});
    $('sgName').textContent=(h.name||'')+' · جلسه‌ی '+fa(n)+' جراحی · '+(ses.jalali||'')+' · اصلاح مدیر';const old=$('m43bBan');if(old)old.remove();const d=document.createElement('div');d.id='m43bBan';d.className='banner info';d.setAttribute('role','status');
    d.textContent='اصلاح جلسه‌ی '+fa(n)+' ('+(ses.jalali||'')+') توسط مدیر. ایمپلنت‌ها، فیکسچرها، مواد و پزشک‌ها را درست کنید و «ثبت جلسه» را بزنید: انبار به اندازه‌ی تفاوت اصلاح می‌شود و مبلغ جراحی دوباره حساب می‌شود. پیگیری‌ها، نوبت‌ها و «آخرین جلسه» همان می‌مانند.';
    const v=$('viewSurg');v.insertBefore(d,v.firstChild);const t=$('toast');if(t)t.hidden=true}catch(e){}
  }catch(e){toast(e.message,1)}finally{MM.busy=false}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m43bfix]');if(!t)return;e.preventDefault();pick(t.dataset.m43bfix)});
try{if(typeof ACT_L==='object')Object.assign(ACT_L,{surgFix:'اصلاح جلسه‌ی جراحی (مدیر)'})}catch(e){}
window.m43b={pick,state:()=>MM};
})();
