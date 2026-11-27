/* ---------- m46c (owner, 2026-11-17): surgery sheet «سایر خدمات» (was «سایر درمان‌ها») — for work nobody expected, so the session never stops:
   every row has the name of the service, the amount, and now the teeth (tooth chart), a count and the doctor who did it. Kept with the session
   (session.othx beside session.oth); shown in the review and in the patient file. ---------- */
(function(){
const XK=id=>'implantSurgOthX:'+id,LBL='سایر خدمات';
const X=o=>o.x||(o.x={teeth:[],n:'',doc:''});
const docs=()=>{const L=[];const put=n=>{n=String(n||'').trim();if(n&&!L.includes(n))L.push(n)};try{put($('sg_by').value);put(SURGEON());ASSTS().forEach(put);(SET.docs||[]).forEach(put)}catch(e){}return L};
const rows=()=>((SURG&&SURG.oth)||[]).filter(o=>String(o.t||'').trim());
const xTxt=x=>{const P=[];if(x&&x.teeth&&x.teeth.length)P.push('دندان '+toothTxt(x.teeth));if(x&&Number(x.n))P.push(fa(Number(x.n))+' عدد');if(x&&x.doc)P.push(x.doc);return P.join(' · ')};
function rename(){try{const c=document.querySelector('#sgPick2 [data-m31oth]');if(c)c.firstChild.nodeValue=c.firstChild.nodeValue.replace('سایر درمان‌ها',LBL);const h=document.querySelector('#m31Oth .h2t');if(h)h.textContent=LBL;const s=document.querySelector('#m31Oth .sgdoc');if(s)s.textContent='کاری که انتظارش نبود یا در فهرست نیست';
    const n=document.querySelector('#m31Oth p.note');if(n&&!n.dataset.m46){n.dataset.m46='1';n.textContent='نام خدمت و مبلغ آن را بنویسید؛ دندان‌ها، تعداد و پزشک انجام‌دهنده را هم می‌توانید ثبت کنید. مبلغ به «هزینه‌ی کارهای انجام‌شده» اضافه می‌شود؛ اگر رایگان است یا مبلغ را نمی‌دانید خالی بگذارید.'}}catch(e){}}
function extras(){try{if(!SURG||!SURG.oth)return;const D=docs();document.querySelectorAll('#m31Oth .m31or').forEach((r,i)=>{const o=SURG.oth[i];if(!o||(r.nextElementSibling&&r.nextElementSibling.classList.contains('m46x')))return;const x=X(o);
    r.insertAdjacentHTML('afterend',`<div class="m46x"><button type="button" class="btn sm ghost" data-m46t="${i}">${x.teeth.length?'دندان‌ها: '+esc(toothTxt(x.teeth)):'انتخاب دندان‌ها (اختیاری)'}</button><input data-m46n="${i}" inputmode="numeric" placeholder="تعداد" value="${esc(x.n?fa(Number(x.n)):'')}" aria-label="تعداد ${fa(i+1)}"><select data-m46d="${i}" aria-label="پزشک انجام‌دهنده ${fa(i+1)}"><option value="">پزشک انجام‌دهنده…</option>${D.concat(x.doc&&!D.includes(x.doc)?[x.doc]:[]).map(d=>`<option${d===x.doc?' selected':''}>${esc(d)}</option>`).join('')}</select></div>`)})}catch(e){console.error('m46c',e)}}
const stash=()=>{try{if(!SURG)return;const m={};rows().forEach(o=>{const x=o.x||{};if((x.teeth&&x.teeth.length)||x.n||x.doc)m[String(o.t).trim()]={teeth:(x.teeth||[]).slice(),n:x.n||'',doc:x.doc||''}});if(Object.keys(m).length)localStorage.setItem(XK(SURG.id),JSON.stringify({d:jalali(new Date()).slash,m}));else localStorage.removeItem(XK(SURG.id))}catch(e){}};
const keep=()=>{try{if(typeof m31Keep==='function')m31Keep()}catch(e){}stash()};
{const _c=m31Cards;m31Cards=function(){const r=_c.apply(this,arguments);rename();extras();return r}}
{const _h=m31Chips;m31Chips=function(){const r=_h.apply(this,arguments);rename();return r}}
/* extras typed today come back when the same session is opened again on this tablet (draft, same-day edit) */
{const _o=openSurg;openSurg=function(x){const r=_o.apply(this,arguments);try{if(SURG&&Array.isArray(SURG.oth)){const d=JSON.parse(localStorage.getItem(XK(SURG.id))||'null');if(d&&d.d===jalali(new Date()).slash&&d.m)SURG.oth.forEach(o=>{const k=String(o.t||'').trim();const e0=!o.x||(!(o.x.teeth||[]).length&&!o.x.n&&!o.x.doc);if(k&&d.m[k]&&e0)o.x={teeth:(d.m[k].teeth||[]).slice(),n:d.m[k].n||'',doc:d.m[k].doc||''}});try{m31Cards()}catch(e){}}}catch(e){}return r}}
/* tooth chart */
let TI=-1;
function chart(){const o=SURG.oth[TI];if(!o)return;const x=X(o),tb=(k,n)=>`<button type="button" class="t" data-m46k="${k}" aria-pressed="${x.teeth.includes(k)}">${n}</button>`,half=(q,rev)=>(rev?[8,7,6,5,4,3,2,1]:[1,2,3,4,5,6,7,8]).map(n=>tb(q+n,n)).join('');
  const s=mkSheet('m46T',`<h3>دندان‌های «${esc(String(o.t||'').trim()||'خدمت')}»</h3><div class="chart"><div class="chart-in" style="--n:8"><div class="jaw"><span class="jlabel">بالا</span><div class="half">${half('UR',1)}</div><span class="mid"></span><div class="half">${half('UL',0)}</div></div><div class="jaw"><span class="jlabel">پایین</span><div class="half">${half('LR',1)}</div><span class="mid"></span><div class="half">${half('LL',0)}</div></div></div></div><p class="note" id="m46TN">${x.teeth.length?esc(toothTxt(x.teeth)):'دندانی انتخاب نشده.'}</p><div class="btns"><button type="button" class="btn" id="m46TOk">تأیید</button><button type="button" class="btn ghost" id="m46TClr">پاک کردن</button></div>`);s.hidden=false}
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('button');if(!t||!SURG||!SURG.oth)return;const d=t.dataset;
  if(d.m46t!==undefined){TI=Number(d.m46t);chart();return}
  if(d.m46k){const o=SURG.oth[TI];if(!o)return;const x=X(o),i=x.teeth.indexOf(d.m46k),auto=!x.n||Number(x.n)===x.teeth.length;if(i>=0)x.teeth.splice(i,1);else x.teeth.push(d.m46k);x.teeth.sort();if(auto)x.n=x.teeth.length?String(x.teeth.length):'';SURG.dirty=true;t.setAttribute('aria-pressed',String(i<0));const n=$('m46TN');if(n)n.textContent=x.teeth.length?toothTxt(x.teeth):'دندانی انتخاب نشده.';return}
  if(t.id==='m46TClr'){const o=SURG.oth[TI];if(o){const x=X(o);if(Number(x.n)===x.teeth.length)x.n='';x.teeth=[]}chart();return}
  if(t.id==='m46TOk'){$('m46T').hidden=true;keep();try{m31Cards()}catch(x){}return}});
document.addEventListener('input',e=>{const i=e.target;if(!i||!i.dataset||i.dataset.m46n===undefined||!SURG||!SURG.oth)return;const o=SURG.oth[Number(i.dataset.m46n)];if(!o)return;const n=Math.min(99,num(i.value));X(o).n=n?String(n):'';i.value=n?fa(n):'';SURG.dirty=true;keep()});
document.addEventListener('input',e=>{const i=e.target;if(i&&i.dataset&&i.dataset.m31on!==undefined&&SURG)setTimeout(stash,0)});
document.addEventListener('change',e=>{const s=e.target;if(!s||!s.dataset||s.dataset.m46d===undefined||!SURG||!SURG.oth)return;const o=SURG.oth[Number(s.dataset.m46d)];if(!o)return;X(o).doc=s.value;SURG.dirty=true;keep()});
/* the session and the review */
{const _s=surgSave;surgSave=function(t){const r=_s.apply(this,arguments);try{if(SURG&&typeof SGP!=='undefined'&&SGP&&SGP.ses){const R=rows(),L=R.map(o=>{const x=o.x||{};return {teeth:(x.teeth||[]).slice(),n:Number(x.n)||0,doc:x.doc||''}});
    if(Array.isArray(SGP.ses.oth)&&SGP.ses.oth.length===L.length&&L.some(x=>x.teeth.length||x.n||x.doc)){SGP.ses.othx=L;stash();
      const b=$('srBody');if(b){const h4=[...b.querySelectorAll('h4')].find(h=>/سایر درمان‌ها|سایر خدمات/.test(h.textContent));if(h4){h4.textContent=LBL;const ul=h4.nextElementSibling;if(ul)[...ul.querySelectorAll('li')].forEach((li,i)=>{const tx=xTxt(L[i]);if(tx&&!li.querySelector('.m46r'))li.insertAdjacentHTML('beforeend',` <small class="m46r">(${esc(tx)})</small>`)})}}}
    else delete SGP.ses.othx}}catch(e){console.error('m46c save',e)}return r}}
/* patient file: the other services of every session */
{const _f=renderFile;renderFile=function(){const out=_f.apply(this,arguments);try{if(PF&&PF.j&&(PF.tab||'tl')==='tl'){const box=document.querySelector('#pfBody .tl');if(box){const items=[...box.querySelectorAll('.tl-i')],price=['consultant','staff','manager','accountant'].includes(ROLE);
    (((PF.j.surg||{}).sessions)||[]).forEach(ss=>{const O=Array.isArray(ss.oth)?ss.oth:[];if(!O.length)return;const el=items.find(x=>{const b=x.querySelector('b');return b&&b.textContent.trim()===`جلسه‌ی ${fa(ss.n||0)} جراحی`});if(!el||el.querySelector('.m46o'))return;
      el.querySelector('div').insertAdjacentHTML('beforeend',`<p class="m46o">${LBL}: ${O.map((o,i)=>{const tx=xTxt((ss.othx||[])[i]);return esc(o.t)+(tx?' ('+esc(tx)+')':'')+(price&&o.amt?' — '+fa(o.amt)+' تومان':'')}).join('؛ ')}</p>`)})}}}catch(e){}return out}}
window.m46c={rows,xTxt};
})();
