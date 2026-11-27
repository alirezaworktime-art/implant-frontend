/* ---------- m46a (owner, 2026-11-17): (1) reception — a confirmed patient waiting for a surgery appointment («نوبت جراحی» in the work list) can be sent
   straight to the surgery cartable, without booking an appointment: «ارجاع مستقیم به جراحی». The usual checks of the referral stay (payment gate,
   «plan not chosen yet» and «brand not chosen yet» sheets). (2) surgery sheet and patient file — the implant brand of the patient is written at the
   top of the plan summary (with the special teeth of other brands), so the surgeon sees it. ---------- */
(function(){
const GN=g=>{const b=BRANDS.find(x=>x.k===g);return b?b.n:(g||'')};
/* ---- (1) direct referral ---- */
function addBtns(){if(ROLE!=='staff'||typeof TASKS==='undefined')return;const put=(anchor,plan,name)=>{const acts=anchor.closest('.acts')||anchor.parentElement;if(!acts||acts.querySelector('[data-m46]'))return;
    anchor.insertAdjacentHTML('beforebegin',`<button class="btn sm main" type="button" data-tosurg="${esc(plan)}" data-m46="1" data-m46n="${esc(name||'')}">ارجاع مستقیم به جراحی</button>`)};
  document.querySelectorAll('button[data-tbook]').forEach(b=>{const k=TASKS.find(x=>x.id===b.dataset.tbook);if(k&&k.kind==='book'&&!k.done&&k.plan)put(b,k.plan,k.name)});
  document.querySelectorAll('button[data-booklost]').forEach(b=>{const k=TASKS.find(x=>x.id===b.dataset.tid);if(k&&k.kind==='book'&&!k.done&&k.plan)put(b,k.plan,k.name)})}
{const _r=renderTasks;renderTasks=function(){const r=_r.apply(this,arguments);try{addBtns()}catch(e){console.error('m46a',e)}return r}}
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('button[data-m46]');if(!t||t.dataset.m46ok||t.disabled)return;e.preventDefault();e.stopImmediatePropagation();
  uxAsk({title:'ارجاع مستقیم به جراحی',msg:`${t.dataset.m46n||'این بیمار'} همین حالا، بدون ثبت نوبت، به کارتابل جراحی فرستاده شود؟ اگر برند یا طرح بیمار هنوز انتخاب نشده یا پرداخت پارت جراحی کامل نیست، همان‌جا پرسیده می‌شود.`,ok:'بله، بفرست',cancel:'نه'}).then(y=>{if(!y||!t.isConnected)return;t.dataset.m46ok='1';t.click();setTimeout(()=>{try{delete t.dataset.m46ok}catch(x){}},0)})},true);
/* a patient whose brand the consultant left to reception: the refusal opens «تعیین تکلیف مالی», where the brand is asked */
{const _a=api;api=function(action,payload){const p=_a.apply(this,arguments);if(action!=='toSurgery'||ROLE!=='staff'||!payload||!payload.id)return p;
  return Promise.resolve(p).catch(e=>{try{if(/برند ایمپلنت بیمار هنوز انتخاب نشده/.test((e&&e.message)||''))setTimeout(()=>{try{const b=document.createElement('button');b.type='button';b.hidden=true;b.dataset.p4rest=payload.id;document.body.appendChild(b);b.click();b.remove()}catch(x){}},400)}catch(x){}throw e})}}
/* ---- (2) the brand of the patient ---- */
function brandLine(r){try{if(!r||!r.s||!r.s.imp)return '';const used=qty(r.s.imp,SEC.imp)>0||['aox','ovd','zyg','sub'].some(k=>SEC[k]&&r.s[k]&&qty(r.s[k],SEC[k])>0);if(!used)return '';
  const b=r.brand&&r.brand!=='ref'?GN(r.brand):'هنوز انتخاب نشده';let sp='';try{const L=(r.s.imp.sp||[]).filter(x=>x&&x.k&&r.s.imp.sel[x.k]&&x.b);if(L.length)sp=' · موارد خاص: '+L.map(x=>toothTxt([x.k])+' '+x.b).join('، ')}catch(e){}
  return 'برند ایمپلنت بیمار: '+b+sp}catch(e){return ''}}
{const _r=renderSurg;renderSurg=function(){const r=_r.apply(this,arguments);try{const el=$('sgPlan');if(el&&SURG&&!SURG.arc){const old=el.querySelector('.m46b');if(old)old.remove();const t=brandLine(SURG.rec);if(t)el.insertAdjacentHTML('afterbegin',`<p class="m46b">${esc(t)}</p>`)}}catch(e){console.error('m46a brand',e)}return r}}
{const _f=renderFile;renderFile=function(){const out=_f.apply(this,arguments);try{if(PF&&PF.j&&(PF.tab||'tl')==='tl'&&!((PF.j.surg||{}).arc)){const box=document.querySelector('#pfBody .tl');if(box&&!box.querySelector('.m46b')){const el=[...box.querySelectorAll('.tl-i')].find(x=>{const b=x.querySelector('b');return b&&b.textContent.trim()==='تأیید طرح درمان'});
    const t=el&&brandLine(fromDoc(PF.id,PF.j.data||{}));if(el&&t)el.querySelector('div').insertAdjacentHTML('beforeend',`<p class="m46b">${esc(t)}</p>`)}}}catch(e){}return out}}
window.m46a={brandLine};
})();
