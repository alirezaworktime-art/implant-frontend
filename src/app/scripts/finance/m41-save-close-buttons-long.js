/* ---------- m41 (owner, 2026-11-17): (1) the save / close buttons of a long page are repeated in a dock at the bottom of the screen while the real ones
   are out of sight (the dock only presses the real button); in long windows the button row stays at the bottom; (2) paper files: the balance shown while
   typing is the one the server will store, and a line under «مانده‌ی بدهی طبق پرونده» says what the field means. ---------- */
(function(){
const VIEWS=['viewSurg','viewArc6','viewForm','viewPros','viewRx','viewUsers','viewAcc','viewInv'];
const KEY=/ثبت|ذخیره|ارسال|تأیید|تایید/;let cur=null,sig='';
function find(){if([...document.querySelectorAll('.sheet')].some(s=>!s.hidden))return null;
  const v=VIEWS.map(id=>document.getElementById(id)).find(e=>e&&!e.hidden&&e.offsetParent!==null);if(!v)return null;
  if(document.documentElement.scrollHeight<innerHeight*1.35)return null;
  const rows=[...v.querySelectorAll('.btns')].filter(r=>r.offsetParent!==null&&!r.closest('.sheet,#m41Dock,details:not([open])')&&[...r.querySelectorAll('button')].some(b=>b.offsetParent!==null&&!b.disabled&&KEY.test(b.textContent)&&!b.classList.contains('ghost')&&!b.classList.contains('sm')));
  if(!rows.length)return null;let best=rows[0],by=-1;rows.forEach(r=>{const y=r.getBoundingClientRect().top+scrollY;if(y>by){by=y;best=r}});
  const pad=document.body.classList.contains('m41dock')?84:0;if(by<document.documentElement.scrollHeight-pad-Math.max(700,innerHeight)-400)return null;return best}
function tick(){let d=document.getElementById('m41Dock');const row=find();let show=false,B=[];
  if(row){const r=row.getBoundingClientRect();show=r.top>innerHeight-8||r.bottom<0;B=[...row.querySelectorAll('button')].filter(b=>b.offsetParent!==null)}
  if(!show){if(d&&!d.hidden){d.hidden=true;document.body.classList.remove('m41dock')}cur=null;sig='';return}
  if(!d){d=document.createElement('div');d.id='m41Dock';d.setAttribute('role','toolbar');d.setAttribute('aria-label','دکمه‌های ثبت');document.body.appendChild(d)}
  const s=B.map(b=>b.className+'|'+b.textContent.trim()+'|'+b.disabled).join('~');
  if(s!==sig||cur!==row){sig=s;cur=row;d.innerHTML=B.map((b,i)=>`<button type="button" class="${esc(b.className)}" data-m41i="${i}"${b.disabled?' disabled':''}>${esc(b.textContent.trim())}</button>`).join('')}
  d.hidden=false;document.body.classList.add('m41dock')}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#m41Dock [data-m41i]');if(!t||!cur)return;e.preventDefault();
  const b=[...cur.querySelectorAll('button')].filter(x=>x.offsetParent!==null)[Number(t.dataset.m41i)];if(b&&!b.disabled)b.click();setTimeout(tick,60)});
let T=0;const later=()=>{clearTimeout(T);T=setTimeout(()=>{try{tick()}catch(e){console.error('m41',e)}},80)};
addEventListener('scroll',later,{passive:true});addEventListener('resize',later);
const start=()=>{new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','disabled']});later()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
/* paper file: the same arithmetic as the server */
try{const _c=a6Calc;a6Calc=function(){const C=_c.apply(this,arguments);try{const S=A6,rem=S.rem===''||S.rem==null?null:num(S.rem),want=C.paid+(!S.settled&&rem!=null?rem:0),vt=Math.max(C.net-C.imp,want>C.net?want:0);C.m41over=vt-(C.net-C.imp);C.bal=vt-C.paid}catch(e){}return C};
  const _m=a6MoneyHTML;a6MoneyHTML=function(){let h=_m.apply(this,arguments);try{const C=a6Calc(),S=A6;
    const hint=`<p class="m41hint">«مانده‌ی بدهی طبق پرونده» یعنی بدهی‌ای که <b>بعد از پرداخت‌های بالا</b> هنوز مانده است. اگر بیمار همه را پرداخته، این خانه را خالی بگذارید و «حساب تسویه است» را بزنید.${S.rem!==''&&S.rem!=null&&!S.lines.length?' برای ذخیره، اول درمان‌های پرونده را وارد کنید.':''}${C.m41over>0?' جمع هزینه‌ی درمان‌های واردشده '+fa(C.m41over)+' تومان کمتر از «پرداخت‌ها + مانده» است؛ همین مقدار به جمع پرونده اضافه می‌شود.':''}</p>`;
    h=h.replace('<div class="a6sum"><span>جمع پرداخت‌ها</span>',hint+'<div class="a6sum"><span>جمع پرداخت‌ها</span>')}catch(e){}return h}}catch(e){}
window.m41={tick};
})();
