
/* ---------- m60a (owner, 2026-11-23): surgery day — «موجودی فیکسچر» for the assistant: what we don't have, by brand, and which diameter × length we have.
   Read-only from the stock (invGet) + the settings catalog. «نداریم» = موجودی صفر یا منفی. Buttons: top of the surgery day + inside the implant sheet. ---------- */
const M60={b:'',only:false};
function m60Data(){const Q={},key=(b,s,d,l)=>sysKey(b,s)+'|'+nk(d)+'|'+nk(l),S=new Map();
  (INV.items||[]).filter(i=>i.kind==='fix').forEach(i=>{const k=key(i.b,i.sys,i.d,i.l);Q[k]=(Q[k]||0)+(Number(i.qty)||0)});
  const sys=(b,s)=>{const k=sysKey(b,s);let o=S.get(k);if(!o){o={b:String(b||'').trim(),sys:String(s||'').trim(),dl:{}};S.set(k,o)}return o},put=(o,d,l)=>{const L=o.dl[d]=o.dl[d]||[];if(!L.some(x=>nk(x)===nk(l)))L.push(l)};
  catM().forEach(c=>{const o=sys(c.b,c.sys);(c.d||[]).forEach(d=>(catLens(c,d)||[]).forEach(l=>put(o,String(d),String(l))))});
  (INV.items||[]).filter(i=>i.kind==='fix'&&i.b&&i.d&&i.l).forEach(i=>{const o=sys(i.b,i.sys),d=Object.keys(o.dl).find(x=>nk(x)===nk(i.d))||String(i.d);put(o,d,String(i.l))});
  const srt=a=>a.sort((x,y)=>parseFloat(toEn(x))-parseFloat(toEn(y))||String(x).localeCompare(y));
  const L=[...S.values()].filter(o=>o.b&&Object.keys(o.dl).length).map(o=>{const D=srt(Object.keys(o.dl)),ls=[];D.forEach(d=>o.dl[d].forEach(l=>{if(!ls.some(x=>nk(x)===nk(l)))ls.push(l)}));srt(ls);
    const q=(d,l)=>Q[key(o.b,o.sys,d,l)]||0,miss=[];D.forEach(d=>srt(o.dl[d]).forEach(l=>{if(q(d,l)<=0)miss.push([d,l])}));return Object.assign(o,{D,ls,q,miss})});
  const B=new Map();L.forEach(o=>{const k=o.b.toLowerCase();if(!B.has(k))B.set(k,{b:o.b,S:[]});B.get(k).S.push(o)});
  return [...B.values()].sort((a,b)=>a.b.localeCompare(b.b,'fa'))}
function m60Sz(d,l){return `<span class="m60z">${esc(faD(d))} × ${esc(faD(l))}</span>`}
function m60Draw(){const el=$('m60Body');if(!el)return;if(!INV.loaded){el.innerHTML='<div class="empty">در حال بارگذاری انبار…</div>';return}
  const B=m60Data();if(!B.length){el.innerHTML='<div class="empty">هنوز فیکسچری در انبار یا فهرست برندهای تنظیمات ثبت نشده است.</div>';return}
  if(M60.b&&!B.some(x=>x.b===M60.b))M60.b='';const nM=x=>x.S.reduce((a,o)=>a+o.miss.length,0);
  let h=`<div class="chips m60bs"><button type="button" class="chip" data-m60b="" aria-pressed="${!M60.b}">همه‌ی برندها</button>${B.map(x=>{const n=nM(x);return `<button type="button" class="chip" data-m60b="${esc(x.b)}" aria-pressed="${M60.b===x.b}">${esc(x.b)}${n?` <span class="m60n">${fa(n)}</span>`:''}</button>`}).join('')}</div>`;
  if(!M60.b){const R=B.filter(x=>nM(x));h+=`<h4 class="m60h">نداریم <small>(موجودی صفر · قطر × طول)</small></h4>`+(R.length?R.map(x=>`<div class="m60mb"><button type="button" class="m60bn" data-m60b="${esc(x.b)}">${esc(x.b)} <small>${fa(nM(x))} سایز</small></button>${x.S.filter(o=>o.miss.length).map(o=>`<div class="m60ml">${o.sys&&x.S.length>1?`<small>${esc(o.sys)}</small>`:''}${o.miss.map(([d,l])=>m60Sz(d,l)).join('')}</div>`).join('')}</div>`).join(''):'<div class="m60ok">همه‌ی سایزها موجود است.</div>')
    +'<p class="note">برای دیدن قطر و طول‌های موجود، روی برند بزنید.</p>';el.innerHTML=h;return}
  const x=B.find(y=>y.b===M60.b);
  h+=`<div class="chips"><button type="button" class="chip" data-m60o="0" aria-pressed="${!M60.only}">همه‌ی سایزها</button><button type="button" class="chip" data-m60o="1" aria-pressed="${M60.only}">فقط نداریم</button></div>`;
  x.S.forEach(o=>{h+=`<h4 class="m60h">${esc(o.b)}${o.sys?' · '+esc(o.sys):''} <small>${o.miss.length?fa(o.miss.length)+' سایز نداریم':'همه موجود'}</small></h4>`;
    if(M60.only){h+=o.miss.length?`<p class="note" style="margin:0">قطر × طول</p><div class="m60ml">${o.miss.map(([d,l])=>m60Sz(d,l)).join('')}</div>`:'<div class="m60ok">همه‌ی سایزها موجود است.</div>';return}
    h+=`<div class="m60tw"><table class="m60t"><thead><tr><th>قطر \\ طول</th>${o.ls.map(l=>`<th>${esc(faD(l))}</th>`).join('')}</tr></thead><tbody>${o.D.map(d=>`<tr><th>${esc(faD(d))}</th>${o.ls.map(l=>{if(!o.dl[d].some(y=>nk(y)===nk(l)))return '<td class="na">·</td>';const q=o.q(d,l);return q>0?`<td class="ok">${fa(q)}</td>`:'<td class="no">۰</td>'}).join('')}</tr>`).join('')}</tbody></table></div>`});
  h+='<p class="note">عدد = تعداد موجود در انبار · <b class="m60r">۰</b> = نداریم · نقطه = این طول برای این قطر نیست.</p>';el.innerHTML=h}
function m60Open(b){let s=$('m60Sheet');if(!s){s=document.createElement('div');s.className='sheet';s.id='m60Sheet';s.hidden=true;
    s.innerHTML='<div class="in"><h3>موجودی فیکسچر</h3><div id="m60Body"></div><div class="btns"><button class="btn ghost" type="button" data-m60x>بستن</button></div></div>';document.body.append(s)}
  if(b!==undefined)M60.b=b;M60.only=false;s.hidden=false;m60Draw();try{pollInv(true).then(()=>{if(!s.hidden)m60Draw()})}catch(e){}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m60],[data-m60b],[data-m60o],[data-m60x]');if(!t)return;const d=t.dataset;
  if(d.m60!==undefined){let b='';if(d.m60==='imp'){try{const c=catM()[$('imp_cat').value];b=c?c.b:String($('imp_b').value||'').trim()}catch(x){}}m60Open(b);return}
  if(d.m60x!==undefined){$('m60Sheet').hidden=true;return}
  if(d.m60b!==undefined){M60.b=d.m60b;M60.only=false;m60Draw();const i=document.querySelector('#m60Sheet .in');if(i)i.scrollTop=0;return}
  if(d.m60o!==undefined){M60.only=d.m60o==='1';m60Draw()}});
/* the buttons */
(function(){const add=()=>{const a=document.querySelector('#viewSurg .sgpat');if(a&&!$('m60Top')){const b=document.createElement('button');b.type='button';b.id='m60Top';b.className='btn sm ghost m60btn';b.dataset.m60='top';b.textContent='موجودی فیکسچر';a.append(b)}
  const s=$('impStock');if(s&&!$('m60Imp')){const b=document.createElement('button');b.type='button';b.id='m60Imp';b.className='btn sm ghost';b.dataset.m60='imp';b.textContent='موجودی فیکسچر (همه‌ی سایزها)';s.after(b)}};
  try{add()}catch(e){}document.addEventListener('DOMContentLoaded',()=>{try{add()}catch(e){}})})();
