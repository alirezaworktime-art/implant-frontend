/* ---------- q2: the sum of each brand (qty × unit price) is shown under its own brand input instead of one long line ---------- */
function q2Paint(){try{if(typeof F==='undefined'||!F||SURG)return;const S=AS();document.querySelectorAll('small.q2sum').forEach(el=>{const x=SEC[el.dataset.q2s],s=S[el.dataset.q2s];if(!x||!s){el.innerHTML='';return}const q=qty(s,x),u=num((s.bp||{})[el.dataset.q2b]);el.innerHTML=q&&u?`${fa(q)} × ${fa(u)} = <b>${fa(q*u)}</b>`:''})}catch(e){}}
{const _r=recalc;recalc=function(){const r=_r.apply(this,arguments);q2Paint();return r}}
{const _s=reSec;reSec=function(){const r=_s.apply(this,arguments);q2Paint();return r}}
