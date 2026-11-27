/* ---------- q10: accounts «K70» → «K700», «پاد» → «K10»; cheque payees + مائده سادات، مبینا سادات، نگارین، «سایر» (typed name) ---------- */
const Q10_OTHER='*';
function q10Other(t,attr,obj){const w=t.closest('.chips');if(!w)return;let inp=w.parentElement.querySelector('input.q10other');const on=t.dataset[attr]===Q10_OTHER;
  if(on){if(!inp){w.insertAdjacentHTML('afterend','<input class="q10other" maxlength="60" placeholder="نام گیرنده‌ی چک را بنویسید" style="margin-top:6px">');inp=w.parentElement.querySelector('input.q10other');inp.addEventListener('input',()=>{obj.payee=inp.value.trim()||Q10_OTHER})}inp.hidden=false;obj.payee=inp.value.trim()||Q10_OTHER;setTimeout(()=>{try{inp.focus()}catch(e){}},30)}
  else if(inp)inp.hidden=true}
window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.pype!==undefined){setTimeout(()=>q10Other(t,'pype',PYF),0)}else if(d.pcpe!==undefined&&PC){setTimeout(()=>q10Other(t,'pcpe',PC),0)}},true);
/* after a re-render (kind / mode chips) the typed payee is shown again with «سایر» pressed */
function q10Restore(){[['pype',typeof PYF!=='undefined'?PYF:null],['pcpe',typeof PC!=='undefined'?PC:null]].forEach(([attr,obj])=>{if(!obj||!obj.payee)return;const ch=document.querySelector(`[data-${attr}="*"]`);if(!ch)return;const w=ch.closest('.chips');if(!w||w.parentElement.querySelector('input.q10other'))return;const listed=[...w.querySelectorAll('.chip')].some(b=>b.dataset[attr]===obj.payee);if(listed)return;
  w.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',b===ch));w.insertAdjacentHTML('afterend',`<input class="q10other" maxlength="60" value="${esc(obj.payee===Q10_OTHER?'':obj.payee)}" placeholder="نام گیرنده‌ی چک را بنویسید" style="margin-top:6px">`)})}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button'))setTimeout(q10Restore,30)},true);
document.addEventListener('input',e=>{const i=e.target;if(!(i&&i.classList&&i.classList.contains('q10other')))return;const w=i.closest('.f,.fin1w')||i.parentElement;const ch=w&&w.querySelector('[data-pype],[data-pcpe]');if(!ch)return;const obj=ch.dataset.pype!==undefined?PYF:PC;if(obj)obj.payee=i.value.trim()||Q10_OTHER});
