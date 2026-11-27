/* ---------- m39 (owner, 2026-11-17): the side sections of the lab cartable follow the workbench: tiles on top to move inside a group («سفارش‌ها», «تنظیم‌های پایه»),
   and every list drawn as cards with the column name above each value. Only the drawing changes — data, filters, buttons and their actions are the old ones.
   On a wide screen «جدول» brings the old table back (remembered on the device). ---------- */
(function(){
const K='m39view';let TBL=false;try{TBL=localStorage.getItem(K)==='t'}catch(e){}
const wide=()=>{try{return matchMedia('(min-width:1000px)').matches}catch(e){return true}};
const grp=sec=>{try{return (L5MENU.find(g=>g.items.length>1&&g.items.some(i=>i[0]===sec))||null)}catch(e){return null}};
function tabs(){const v=document.getElementById('viewLab'),list=document.getElementById('lbList');if(!v||!list)return;
  const sec=(typeof L5!=='undefined'&&L5&&L5.sec)||'bench',g=sec==='bench'?null:grp(sec);let el=document.getElementById('m39tabs');
  const sup=(()=>{try{return l5Sup()}catch(e){return false}})();
  if(!g||(g.sup&&!sup)){if(el)el.remove();return}
  const h=g.items.filter(i=>i[0]!=='o/new').map(i=>`<button type="button" class="m39tab" data-l5sec="${esc(i[0])}" aria-current="${i[0]===sec}">${esc((L5T[i[0]]||i[1]))}</button>`).join('');
  if(!el){el=document.createElement('div');el.id='m39tabs';el.className='m39tabs';el.setAttribute('role','navigation');el.setAttribute('aria-label',g.g||'بخش‌ها')}
  if(el._h!==h){el.innerHTML=h;el._h=h}
  if(el.nextElementSibling!==list||el.parentElement!==list.parentElement)list.parentElement.insertBefore(el,list);
  const cur=el.querySelector('[aria-current="true"]');if(cur&&el._s!==sec){el._s=sec;try{cur.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}}}
function cards(){const list=document.getElementById('lbList');if(!list)return;const sec=(typeof L5!=='undefined'&&L5&&L5.sec)||'bench';if(sec==='bench')return;
  const T=[...list.querySelectorAll('table.tbl')];let any=false;
  T.forEach(t=>{const w=t.parentElement,rep=sec==='rep'||!!t.closest('.l8ev');
    if(rep){if(w&&w.classList.contains('l5tw'))w.classList.add('m39s');return}
    any=true;const on=!(TBL&&wide());t.classList.toggle('m39c',on);if(w&&w.classList.contains('l5tw'))w.classList.toggle('m39w',on);
    if(!on||t.dataset.m39===String(t.rows.length))return;t.dataset.m39=String(t.rows.length);
    const H=[...t.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    [...t.tBodies].forEach(b=>[...b.rows].forEach(r=>{const C=[...r.cells];if(C.length===1&&C[0].colSpan>1){r.classList.add('m39one');return}
      let head=false;C.forEach((c,i)=>{const l=H[i]||'',txt=c.textContent.trim(),ctl=c.querySelector('button,a,input,select');
        c.classList.remove('m39e','m39h','m39a');
        if(l)c.dataset.l=l;else delete c.dataset.l;
        if(ctl&&(!l||i===C.length-1||/^(کارها|عملیات)$/.test(l))){c.classList.add('m39a');return}
        if(l==='ردیف'||((!txt||/^[—–-]$/.test(txt))&&!ctl&&!c.querySelector('svg,img,.l6x'))){c.classList.add('m39e');return}
        if(!head&&/^(بیمار|نام|نام بیمار|طرف حساب|نام فایل|عنوان|نام طرف حساب)/.test(l)){c.classList.add('m39h');head=true}})}))});
  let bar=document.getElementById('m39bar');
  if(!bar){bar=document.createElement('div');bar.id='m39bar';bar.className='m39bar';bar.innerHTML='<button type="button" data-m39v="c">کارت</button><button type="button" data-m39v="t">جدول</button>'}
  if(bar.parentElement!==list.parentElement||bar.nextElementSibling!==list)list.parentElement.insertBefore(bar,list);
  bar.hidden=!(any&&wide());bar.querySelector('[data-m39v="c"]').setAttribute('aria-pressed',String(!TBL));bar.querySelector('[data-m39v="t"]').setAttribute('aria-pressed',String(TBL))}
let Tm=0;const tick=()=>{clearTimeout(Tm);Tm=setTimeout(()=>{try{if(typeof ROLE!=='undefined'&&ROLE==='lab'){tabs();cards()}}catch(e){console.error('m39',e)}},30)};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m39v]');if(!t)return;TBL=t.dataset.m39v==='t';try{localStorage.setItem(K,TBL?'t':'c')}catch(x){}
  document.querySelectorAll('#lbList table.tbl').forEach(x=>{delete x.dataset.m39});tick()});
const start=()=>{const v=document.getElementById('viewLab');if(!v)return;new MutationObserver(tick).observe(v,{childList:true,subtree:true});tick()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
addEventListener('resize',tick);
window.m39={tick};
})();
