
/* ---------- m24 (owner, 2026-11-13): lab workbench like the lab's own site — 200 rows per page, choose which columns are shown; on a phone every order is a card and the page no longer scrolls sideways; after a reload the lab list loads at once ---------- */
const M24_COLS=[[3,'شماره سفارش'],[4,'شماره دستور'],[5,'نام مشتری'],[6,'نام بیمار'],[7,'تاریخ ساخت'],[8,'تاریخ تحویل'],[9,'نام کار'],[10,'تعداد دندان'],[11,'وضعیت / دپارتمان'],[12,'نوع کار'],[13,'رنگ و شماره جعبه'],[14,'توضیحات'],[15,'زمان اجرا']];
let M24_HID=[];try{M24_HID=(JSON.parse(localStorage.getItem('m24cols')||'[]')||[]).map(Number).filter(n=>M24_COLS.some(c=>c[0]===n))}catch(e){M24_HID=[]}
{const _h=typeof l6BenchHTML==='function'?l6BenchHTML:null;if(_h)l6BenchHTML=function(){let h=_h.apply(this,arguments);try{const k='<table class="tbl l5t l6bt">';if(h.includes(k))h=h.split(k).join(`<div class="m24cb"><button type="button" class="btn sm ghost" data-m24cols="1">ستون‌های جدول${M24_HID.length?' ('+fa(M24_HID.length)+' پنهان)':''}</button></div><table class="tbl l5t l6bt${M24_HID.map(n=>' m24h'+n).join('')}">`)}catch(e){}return h}}
function m24Cols(){const s=mkSheet('m24Sh',`<h3>ستون‌های جدول میز کار</h3><p class="note">ستون‌های تیک‌خورده نمایش داده نمی‌شوند. این انتخاب روی همین دستگاه می‌ماند.</p><div class="m24cg">${M24_COLS.map(([n,l])=>`<label><input type="checkbox" value="${n}"${M24_HID.includes(n)?' checked':''}> ${esc(l)}</label>`).join('')}</div><div class="btns"><button class="btn" type="button" data-m24save="1">ذخیره</button><button class="btn ghost" type="button" data-m24all="1">نمایش همه</button><button class="btn ghost" type="button" data-m24x="1">انصراف</button></div>`);s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.hidden=false}
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('[data-m24cols],[data-m24save],[data-m24all],[data-m24x]');if(!t)return;const s=$('m24Sh');
  if(t.dataset.m24cols){m24Cols();return}
  if(t.dataset.m24x){if(s)s.hidden=true;return}
  if(t.dataset.m24all){M24_HID=[]}else if(t.dataset.m24save&&s){M24_HID=[...s.querySelectorAll('input[type=checkbox]:checked')].map(i=>Number(i.value))}
  try{localStorage.setItem('m24cols',JSON.stringify(M24_HID))}catch(e){}
  if(s)s.hidden=true;try{renderLab()}catch(e){}});
/* after a reload the lab view was drawn empty until the first poll (about 10 s later): load the list right away */
{let n=0;const t=setInterval(()=>{try{if(++n>20){clearInterval(t);return}if(typeof ROLE==='undefined'||ROLE!=='lab')return;clearInterval(t);const v=$('viewLab');if(v&&!v.hidden&&!LB.ver)Promise.resolve(pollLab(true)).catch(()=>{})}catch(e){clearInterval(t)}},300)}
