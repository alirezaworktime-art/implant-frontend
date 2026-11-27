/* ---------- m42 (owner, 2026-11-17): staff accounts — (1) a person with several roles picks the cartable after login and may switch later;
   (2) the manager ticks several roles for one account; (3) the manager switches the shared password of a cartable off / on. ---------- */
(function(){
const ALL=['staff','doctor','consultant','surgery','lab','inventory','manager','accountant'];
const L=r=>r==='surgery'?'پزشک (جراحی، چکاپ، پروتز)':(ROLE_LBL[r]||r);
const M={save:null};
/* every request says which cartable this person is working in */
{const _a=api;api=function(action,payload,opt){
  if(action==='userSave'&&M.save&&payload&&payload.u){payload=Object.assign({},payload,{u:Object.assign({},payload.u,{roles:M.save})});M.save=null}
  if(API.as&&!(payload&&payload.as))payload=Object.assign({as:API.as},payload||{});return _a.call(this,action,payload,opt)}}
const MULTI=()=>{try{return JSON.parse(localStorage.getItem('implantMulti')||'{}')}catch(e){return {}}};
const mark=(h,on)=>{if(!h)return;try{const m=MULTI();if(on)m[h]=1;else delete m[h];localStorage.setItem('implantMulti',JSON.stringify(m))}catch(e){}};
const setTile=r=>{LROLE=r;document.querySelectorAll('[data-lrole]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lrole===r));try{$('lgPwLbl').textContent='رمز ورود '+(ROLE_LBL[r]||'')}catch(e){}};
function choose(roles,title,cb){const s=mkSheet('m42Ch',`<h3>${esc(title)}</h3><p class="note">با همین رمز به این کارتابل‌ها دسترسی دارید. یکی را انتخاب کنید.</p><div class="m42t">${roles.map(r=>`<button type="button" class="btn${r===ROLE?' ghost':''}" data-m42pick="${r}">${esc(L(r))}${r===ROLE?' (الان)':''}</button>`).join('')}</div><div class="btns"><button type="button" class="btn ghost" data-m42pick="">انصراف</button></div>`);
  s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.hidden=false;M.cb=cb;const f=s.querySelector('[data-m42pick]');if(f)f.focus()}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m42pick]');if(!t)return;const s=$('m42Ch');if(s)s.hidden=true;const cb=M.cb;M.cb=null;if(cb)cb(t.dataset.m42pick||'')});
const swBtn=()=>{let b=$('m42Sw');if(!b){const o=$('tabOut');if(!o)return null;b=document.createElement('button');b.type='button';b.className='tab';b.id='m42Sw';b.title='تغییر کارتابل';b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg><span>تغییر کارتابل</span>';b.hidden=true;o.parentNode.insertBefore(b,o)}return b};
const swShow=()=>{const b=swBtn();if(b)b.hidden=!(ROLE&&Array.isArray(API.roles)&&API.roles.length>1)};
{const _ar=applyRole;applyRole=function(){const r=_ar.apply(this,arguments);try{swShow()}catch(e){}return r}}
{const _lo=logout;logout=function(){API.as='';API.roles=null;const s=$('m42Ch');if(s)s.hidden=true;M.cb=null;const r=_lo.apply(this,arguments);try{swShow()}catch(e){}return r}}
const _login=login;
login=async function(){const m=$('lgMsg'),pw=$('lg_pw').value;API.as='';API.roles=null;
  if(LROLE==='lf'||LROLE==='oclin'||!CF_ON||FS_ON||IN_GAS)return _login.apply(this,arguments);
  let h=null;try{h=await sha(pw)}catch(e){}
  if(h&&AUTHC()[LROLE]===h&&!MULTI()[h]){API.as=LROLE;const r=_login.apply(this,arguments);   // known on this device: straight in, roles learnt in the background
    api('ping').then(j=>{if(Array.isArray(j.roles)){API.roles=j.roles;saveApi();if(j.roles.length>1){mark(h,true);try{const c=AUTHC();delete c[LROLE];localStorage.setItem('implantAuth',JSON.stringify(c))}catch(e){}}swShow()}}).catch(()=>{});return r}
  m.className='msg';m.textContent='در حال ورود…';API.pw=pw;let j;
  try{j=await api('ping')}catch(e){m.className='msg err';m.textContent=e.message;return}
  const fin=(k,keep)=>{if(h&&keep){const c=AUTHC();c[k.role]=h;try{localStorage.setItem('implantAuth',JSON.stringify(c))}catch(e){}}pwRemember(k.role,pw);enter(k)};
  if(!Array.isArray(j.roles)){if(j.role!==LROLE){API.pw='';m.className='msg err';m.textContent=`این رمز مربوط به ورود ${ROLE_LBL[j.role]||'دیگری'} است.`;return}fin(j,true);return}
  API.roles=j.roles;
  if(j.roles.length<2){mark(h,false);setTile(j.role);API.as=j.role;fin(j,true);return}
  mark(h,true);m.textContent='';
  choose(j.roles,'سلام '+(j.user||'')+'؛ کدام کارتابل؟',async r=>{if(!r){API.pw='';API.roles=null;return}
    API.as=r;setTile(r);m.className='msg';m.textContent='در حال ورود…';try{const k=await api('ping');API.roles=k.roles||j.roles;fin(k,false)}catch(e){m.className='msg err';m.textContent=e.message}})};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#m42Sw');if(!t)return;
  if(typeof dirty!=='undefined'&&dirty&&!$('viewForm').hidden){alertMsg('اول فرم را ذخیره کنید.');return}
  const roles=API.roles||[];choose(roles,'تغییر کارتابل',async r=>{if(!r||r===ROLE)return;const pw=API.pw;logout();API.pw=pw;API.roles=roles;API.as=r;setTile(r);const m=$('lgMsg');m.className='msg';m.textContent='در حال ورود…';
    try{const k=await api('ping');API.roles=k.roles||roles;enter(k)}catch(e2){m.className='msg err';m.textContent=e2.message}})});
/* after a reload */
try{if(API.pw&&ROLE)swShow()}catch(e){}
/* ---- manager: several roles for one account ---- */
function rolesBox(){let b=$('m42Roles');if(b)return b;const sel=$('ua_role');if(!sel)return null;const lab=sel.closest('label');b=document.createElement('div');b.id='m42Roles';b.setAttribute('role','group');b.setAttribute('aria-label','نقش‌ها');
  b.innerHTML=ALL.map(r=>`<label><input type="checkbox" data-m42r="${r}">${esc(L(r))}</label>`).join('');
  const w=document.createElement('div');w.className='f full';w.id='m42RolesW';w.innerHTML='<span>نقش‌ها (یک یا چند مورد)</span>';w.appendChild(b);const n=document.createElement('p');n.className='note';n.style.margin='0';n.textContent='کسی که چند نقش دارد با یک رمز وارد می‌شود و بعد از ورود کارتابل را انتخاب می‌کند.';w.appendChild(n);
  lab.hidden=true;lab.after(w);b.addEventListener('change',sync);return b}
const picked=()=>[...document.querySelectorAll('#m42Roles [data-m42r]:checked')].map(x=>x.dataset.m42r);
function sync(){const p=picked(),sel=$('ua_role');if(!sel)return;const v=p.includes('lab')?'lab':(p[0]||sel.value);if(sel.value!==v){sel.value=v}sel.dispatchEvent(new Event('change'))}
{const _r=renderUsers;renderUsers=function(){const out=_r.apply(this,arguments);try{const b=rolesBox();if(b){const e=UA.edit,R=e?(Array.isArray(e.roles)&&e.roles.length?e.roles:[e.role]):['staff'];
    b.querySelectorAll('[data-m42r]').forEach(x=>{x.checked=R.includes(x.dataset.m42r)});const sel=$('ua_role'),v=R.includes('lab')?'lab':R[0];if(sel&&sel.value!==v){sel.value=v;sel.dispatchEvent(new Event('change'))}}
    (UA.users||[]).forEach(u=>{if(!Array.isArray(u.roles)||u.roles.length<2)return;const bt=document.querySelector('#uaUsers [data-uedit="'+(window.CSS&&CSS.escape?CSS.escape(u.id):u.id)+'"]');const it=bt&&bt.closest('.item'),mt=it&&it.querySelector('.meta');if(!mt||mt.dataset.m42)return;mt.dataset.m42='1';
      mt.insertAdjacentHTML('afterbegin',`<b>${esc(u.roles.map(r=>ROLE_LBL[r]||r).join('، '))}</b>${u.role==='lab'?' · ':''}`);if(u.role!=='lab'){[...mt.childNodes].forEach(n=>{if(n.nodeType===3&&n.textContent.trim()===(ROLE_LBL[u.role]||u.role))n.textContent=''})}})}catch(e){console.error('m42 users',e)}
    try{sharedLoad()}catch(e){}return out}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#uaSave');if(!t||!$('m42Roles'))return;const p=picked();
  if(!p.length){e.preventDefault();e.stopImmediatePropagation();const m=$('uaMsg');m.className='msg err';m.textContent='دست‌کم یک نقش انتخاب کنید.';return}M.save=p},true);
/* ---- manager: shared password of each cartable ---- */
let SH=null,SHT=0;
function sharedBox(){let b=$('m42Sh');if(b)return b;const u=$('uaUsers');if(!u)return null;b=document.createElement('div');b.id='m42Sh';b.className='payform';b.style.marginTop='12px';const card=u.closest('.card')||u.parentNode;card.appendChild(b);return b}
function sharedDraw(){const b=sharedBox();if(!b)return;if(!SH){b.innerHTML='<b>رمز مشترک کارتابل‌ها</b><p class="note">در حال بارگذاری…</p>';return}
  b.innerHTML=`<b>رمز مشترک کارتابل‌ها</b><p class="note">وقتی همه‌ی افراد یک کارتابل حساب شخصی گرفتند، رمز مشترک آن را خاموش کنید تا هر ثبت به نام خود شخص باشد. رمز مشترک مدیر همیشه روشن می‌ماند.</p>`+
    SH.roles.map(r=>{const off=!!SH.off[r],n=SH.count[r]||0;return `<div class="m42row"><div><span class="nm">${esc(L(r))}</span><div class="meta">${off?'<b class="off">خاموش</b>':'روشن'} · ${n?fa(n)+' حساب شخصی فعال':'بدون حساب شخصی فعال'}</div></div><button type="button" class="btn sm ${off?'':'ghost'}" data-m42sh="${r}">${off?'روشن کردن رمز مشترک':'خاموش کردن رمز مشترک'}</button></div>`}).join('')+'<div class="msg" id="m42ShM" role="alert"></div>'}
async function sharedLoad(force){if(ROLE!=='manager')return;const now=Date.now();if(!force&&SH&&now-SHT<4000){sharedDraw();return}SHT=now;sharedDraw();try{SH=await api('pwSharedGet');sharedDraw()}catch(e){const b=sharedBox();if(b)b.innerHTML='<b>رمز مشترک کارتابل‌ها</b><p class="note">'+esc(e.message)+'</p>'}}
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('[data-m42sh]');if(!t||!SH)return;const r=t.dataset.m42sh,off=!SH.off[r],n=SH.count[r]||0;
  if(off){const y=await uxAsk({title:'خاموش کردن رمز مشترک «'+L(r)+'»',msg:n?'از این به بعد فقط با رمز شخصی می‌شود وارد این کارتابل شد ('+fa(n)+' حساب شخصی فعال). کسانی که با رمز مشترک وارد شده‌اند بیرون می‌افتند.':'هیچ حساب شخصی فعالی با این نقش نیست. اگر خاموش کنید، تا ساختن حساب شخصی هیچ‌کس نمی‌تواند وارد این کارتابل شود. مطمئن هستید؟',ok:'خاموش کن',danger:true});if(!y)return}
  t.disabled=true;try{SH=await api('pwShared',{role:r,off:off?1:0,ack:off&&!n?1:0});SHT=Date.now();sharedDraw()}catch(err){t.disabled=false;const m=$('m42ShM');if(m){m.className='msg err';m.textContent=err.message}}});
try{if(typeof ACT_L==='object')Object.assign(ACT_L,{pwShared:'رمز مشترک کارتابل'})}catch(e){}
window.m42={choose,sharedLoad};
})();
