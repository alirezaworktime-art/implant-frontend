
/* ---------- m26 (owner, 2026-11-13): lab definitions like the lab's own site — department «تست لازم» + description, account numbers / e-mail / region / address, bulk delete of empty boxes ---------- */
const M26_F=[['tel','تلفن ثابت'],['m2','موبایل ۲'],['m3','موبایل ۳'],['m4','موبایل ۴'],['t2','تلفن ثابت ۲'],['t3','تلفن ثابت ۳'],['t4','تلفن ثابت ۴'],['email','ایمیل'],['region','منطقه'],['prov','استان'],['city','شهر'],['addr','آدرس']];
const m26Ext=a=>{try{return a&&a.ext?(typeof a.ext==='string'?JSON.parse(a.ext):a.ext)||{}:{}}catch(e){return {}}};
let M26_AC=null;
{const _e=typeof l5AcctEdit==='function'?l5AcctEdit:null;if(_e)l5AcctEdit=async function(id,parent){M26_AC={id:id||''};const _m=alertMsg;alertMsg=function(m){toast(m,1)};try{return await _e.apply(this,arguments)}finally{M26_AC=null;alertMsg=_m}}}
{const _a=l2Ask;l2Ask=function(title,fields,okL){try{if(M26_AC&&Array.isArray(fields)&&fields.some(f=>f&&f.k==='phone')&&!fields.some(f=>f&&String(f.k||'').startsWith('e_'))){const a=(((L5.boot||{}).accts)||[]).find(x=>x.id===M26_AC.id),x=m26Ext(a),i=fields.findIndex(f=>f&&f.k==='phone');
  fields=fields.map(f=>f&&f.k==='phone'?Object.assign({},f,{l:'موبایل (اصلی)'}):f);
  const ex=M26_F.map(([k,l])=>({k:'e_'+k,l,v:x[k]||'',full:k==='addr'?1:0}));fields=fields.slice(0,i+1).concat(ex,fields.slice(i+1))}}catch(e){}return _a.call(this,title,fields,okL)}}
/* accounts table: the other numbers, e-mail and place under the phone */
function m26AcctDeco(){try{if(L5.sec!=='d/acct')return;const A=((L5.boot||{}).accts)||[];document.querySelectorAll('#viewLab tr[data-l5an]').forEach(tr=>{if(tr.dataset.m26)return;const a=A.find(x=>x.id===(tr.dataset.l8row||(tr.querySelector('[data-l8ac],[data-l5ac]')||{dataset:{}}).dataset.l8ac));if(!a)return;tr.dataset.m26='1';const x=m26Ext(a),nums=['tel','m2','m3','m4','t2','t3','t4'].map(k=>x[k]).filter(Boolean),pl=[x.region,x.prov,x.city].filter(Boolean).join('، ');if(!nums.length&&!x.email&&!pl&&!x.addr)return;const td=tr.children[3];if(!td)return;
  tr.dataset.l5an+=' '+nums.concat([x.email,pl,x.addr].filter(Boolean)).join(' ');
  td.insertAdjacentHTML('beforeend',`<div class="meta m26x">${nums.map(n=>`<span dir="ltr">${esc(faD(n))}</span>`).join('')}${x.email?`<span dir="ltr">${esc(x.email)}</span>`:''}${pl?`<span>${esc(pl)}</span>`:''}${x.addr?`<span>${esc(x.addr)}</span>`:''}</div>`)})}catch(e){}}
{const _r=renderLab;renderLab=function(){const r=_r.apply(this,arguments);try{Promise.resolve(r).then(()=>{setTimeout(m26AcctDeco,60);setTimeout(m26AcctDeco,700)})}catch(e){}return r}}
/* boxes: pick several empty ones and delete them together */
{const _d=typeof l8BoxDraw==='function'?l8BoxDraw:null;if(_d)l8BoxDraw=function(L){const r=_d.apply(this,arguments);try{if(!l5Sup()||!L)return r;const bar=L.querySelector('.l8bxbar');if(bar&&!bar.querySelector('[data-m26bd]'))bar.insertAdjacentHTML('beforeend','<button type="button" class="btn sm ghost" data-m26ba="1">انتخاب خالی‌ها</button><button type="button" class="btn sm ghost danger" data-m26bd="1" disabled>حذف انتخاب‌شده‌ها</button>');
  L.querySelectorAll('.l8bx:not(.on)').forEach(x=>{const h=x.querySelector('.l8bxh'),ed=x.querySelector('[data-l5box]');if(!h||!ed||h.querySelector('.m26bc'))return;h.insertAdjacentHTML('afterbegin',`<input type="checkbox" class="m26bc" value="${esc(ed.dataset.l5box)}" aria-label="انتخاب جعبه ${esc(fa(ed.dataset.l5box))}">`)})}catch(e){}return r}}
const m26Sel=()=>[...document.querySelectorAll('#viewLab .m26bc:checked')].filter(c=>!c.closest('.l8bx').hidden).map(c=>c.value);
const m26Btn=()=>{const b=document.querySelector('#viewLab [data-m26bd]');if(b){const n=m26Sel().length;b.disabled=!n;b.textContent=n?`حذف انتخاب‌شده‌ها (${fa(n)})`:'حذف انتخاب‌شده‌ها'}};
document.addEventListener('change',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('m26bc'))m26Btn()});
document.addEventListener('click',async e=>{const t=e.target&&e.target.closest&&e.target.closest('[data-m26ba],[data-m26bd]');if(!t)return;
  if(t.dataset.m26ba){const C=[...document.querySelectorAll('#viewLab .m26bc')].filter(c=>!c.closest('.l8bx').hidden),all=C.length&&C.every(c=>c.checked);C.forEach(c=>c.checked=!all);m26Btn();return}
  const nos=m26Sel();if(!nos.length)return;const ok=await uxAsk({title:'حذف جعبه‌ها',msg:fa(nos.length)+' جعبه‌ی خالی از فهرست حذف شود؟',ok:'بله، حذف شود',cancel:'نه',danger:1});if(!ok)return;
  try{const j=await api('lab5',{op:'boxDelMany',nos});toast(fa(j.n)+' جعبه حذف شد.'+((j.busy||[]).length?' '+fa(j.busy.length)+' جعبه کار باز داشت و ماند.':''));renderLab()}catch(e2){toast(e2.message,1)}});
