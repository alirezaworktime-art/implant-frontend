/* ---------- pa8: «فقط روکش» on a tooth that gets an implant in the same plan is not charged twice (the implant already carries its crown) ---------- */
function p8Dup(r){try{const S=r&&r.s,c=S&&S.crw,i=S&&S.imp;if(!c||!i)return [];return Object.keys(c.sel).filter(k=>c.sel[k]&&isTooth(k)&&i.sel[k])}catch(e){return []}}
(function(){const _rt=rowTotals;rowTotals=function(r,x){const o=_rt(r,x);if(x&&x.id==='crw'){const d=p8Dup(r).length;if(d&&x.price==='unit')o.flat=Math.max(0,o.flat-d*num(r.s.crw.price))}return o}})();
(function(){const _pl=priceLines;priceLines=function(r,x){if(!x||x.id!=='crw')return _pl(r,x);const d=p8Dup(r);if(!d.length)return _pl(r,x);const s=r.s.crw,q=Math.max(0,qty(s,x)-d.length),u=num(s.price),L=[];
  if(q&&u){L.push({t:`${fa(q)} واحد × ${fa(u)}`,c:'#444',s:18});L.push({t:fa(q*u),b:1})}L.push({t:`${fa(d.length)} دندان با ایمپلنت همین طرح (روکش در ایمپلنت حساب شده)`,c:'#777',s:15});return L}})();
(function(){const _rc=recalc;recalc=function(){const v=_rc.apply(this,arguments);try{if(!SURG){const pv={s:AS()},d=p8Dup(pv),el=document.getElementById('calc_crw');
  if(el&&d.length){const s=pv.s.crw,q=qty(s,SEC.crw),n=Math.max(0,q-d.length),u=num(s.price);el.innerHTML=(n?`${fa(n)} واحد × ${fa(u)} = <b>${fa(n*u)}</b><br>`:'')+`<span class="note">${esc(toothTxt(d))}: ایمپلنت همین طرح است و روکشش در «پایه ایمپلنت» حساب شده؛ دوباره حساب نشد.</span>`}}}catch(e){}return v}})();

