/* ---------- m45a (owner, 2026-11-17): surgery sheet —
   (1) «بخیه‌ی این جلسه»: ندارد / جذبی / غیرجذبی (kept with the session; «دو هفته بعد: کشیدن بخیه» follows it);
   (2) «سرجیکال گاید» in the treatment list: jaw + amount, written as a row of «سایر درمان‌ها» (amount from the manager's tariff);
   (3) before a session is saved: a tooth that already got an implant in an earlier session and is recorded as «جدید» again asks for a confirmation;
   (4) before a surgery is finished: a cost far from the plan (more than 30% and more than 5,000,000) asks for a confirmation. ---------- */
(function(){
const JW={U:'فک بالا',L:'فک پایین',B:'هر دو فک'},SUT={no:'بخیه ندارد',abs:'بخیه‌ی جذبی',non:'بخیه‌ی غیرجذبی'},GT='سرجیکال گاید';
const SK=id=>'implantSurgSut:'+id;
/* ---- (1) suture ---- */
function sutUI(){if(!SURG)return;const c=document.querySelector('#viewSurg [data-fu="suture"]');if(!c)return;const host=c.closest('label')||c;let w=$('m45Sut');
  if(!w){host.insertAdjacentHTML('beforebegin',`<div id="m45Sut" class="m45sut"><span>بخیه‌ی این جلسه</span><div class="chips" role="group">${Object.keys(SUT).map(k=>`<button type="button" class="chip" data-m45sut="${k}">${SUT[k]}</button>`).join('')}</div></div>`);w=$('m45Sut')}
  w.hidden=!!SURG.arc;w.querySelectorAll('[data-m45sut]').forEach(b=>b.setAttribute('aria-pressed',String(SURG.sut===b.dataset.m45sut)))}
{const _o=openSurg;openSurg=function(x){const r=_o.apply(this,arguments);try{if(SURG){SURG.sut='';SURG.m45ack='';const d=JSON.parse(localStorage.getItem(SK(SURG.id))||'null');if(d&&d.d===jalali(new Date()).slash&&SUT[d.sut])SURG.sut=d.sut;sutUI();gdChip()}}catch(e){console.error('m45a open',e)}return r}}
{const _r=renderSurg;renderSurg=function(){const r=_r.apply(this,arguments);try{sutUI()}catch(e){}return r}}
/* ---- (2) surgical guide ---- */
const gdRow=()=>((SURG&&SURG.oth)||[]).find(o=>String(o.t||'').trim().startsWith(GT))||null;
const gdJaw=o=>{const t=String((o&&o.t)||'');return /هر دو/.test(t)?'B':/پایین/.test(t)?'L':'U'};
const gdTar=()=>{try{return num((((SET&&SET.prices)||{}).arc_sgd||{}).price)}catch(e){return 0}};
function gdChip(){try{if(!SURG||SURG.arc)return;const B=$('sgPick2');if(!B)return;B.querySelectorAll('[data-m45gd]').forEach(e=>e.remove());const on=!!gdRow(),o=B.querySelector('[data-m31oth]'),h=`<button type="button" class="chip sgc${on?' marked':''}" data-m45gd="1" aria-pressed="${on}">${GT}${on?' ✓':''}</button>`;if(o)o.insertAdjacentHTML('beforebegin',h);else B.insertAdjacentHTML('beforeend',h)}catch(e){}}
{const _p=renderPick;renderPick=function(){const r=_p.apply(this,arguments);gdChip();return r}}
let GD={j:'U',amt:''};
function gdDraw(){const s=mkSheet('m45Gd',`<h3>${GT}</h3><p class="note">فکی که گاید برایش ساخته شد را انتخاب کنید. این ردیف در «سایر درمان‌ها»ی همین جلسه نوشته می‌شود.</p>
    <div class="chips" role="group">${Object.keys(JW).map(k=>`<button type="button" class="chip" data-m45j="${k}" aria-pressed="${GD.j===k}">${JW[k]}</button>`).join('')}</div>
    <label class="f">مبلغ (تومان)<input id="m45GdA" class="price" inputmode="numeric" value="${esc(GD.amt?fmtInput(String(GD.amt)):'')}" placeholder="${gdTar()?'':'خالی = تعرفه‌ی مدیر'}"></label>
    <small class="note" id="m45GdN">${gdTar()?'تعرفه‌ی مدیر: '+fa(gdTar())+' تومان برای هر فک':'اگر خالی بماند، مبلغ از تعرفه‌ی سرجیکال گاید در تنظیمات مدیر حساب می‌شود.'}</small>
    <div class="btns"><button type="button" class="btn" id="m45GdOk">ثبت</button>${gdRow()?'<button type="button" class="btn ghost danger" id="m45GdDel">حذف گاید از این جلسه</button>':''}<button type="button" class="btn ghost" id="m45GdNo">بستن</button></div>`);s.hidden=false}
function gdOpen(){const o=gdRow();GD={j:o?gdJaw(o):'U',amt:o?num(o.amt||''):(gdTar()||'')};if(!o&&GD.amt)GD.amt=gdTar();gdDraw()}
function gdSet(del){SURG.oth=(SURG.oth||[]).filter(o=>!String(o.t||'').trim().startsWith(GT)&&(String(o.t||'').trim()||String(o.amt||'').trim()));
  if(!del)SURG.oth.push({t:GT+' — '+JW[GD.j],amt:GD.amt?String(GD.amt):''});SURG.m31oth=SURG.oth.length>0;SURG.dirty=true;try{m31Keep()}catch(e){}$('m45Gd').hidden=true;renderSurg()}
/* ---- (3) the same tooth again ---- */
function dups(){const had={};(SURG.prev||[]).forEach((ss,i)=>Object.keys((ss&&ss.imp)||{}).forEach(k=>{const m=ss.imp[k]||{};if(m.rs==='fail'&&!Number(m.rep))return;had[k.replace(/b+$/,'')]=ss.n||i+1}));
  return Object.keys(SURG.imp||{}).filter(k=>isTooth(k)&&had[k]&&(SURG.imp[k]||{}).b&&!['redo','fail'].includes((SURG.imp[k]||{}).rs)).map(k=>({k,n:had[k]}))}
{const _s=surgSave;surgSave=function(t){try{if(SURG&&!SURG.arc){const D=dups(),key=D.map(d=>d.k).sort().join();
    if(D.length&&SURG.m45ack!==key){uxAsk({title:'این دندان قبلاً ایمپلنت گرفته است',msg:D.map(d=>toothTxt([d.k])+' در جلسه‌ی '+fa(d.n)).join('؛ ')+' ایمپلنت گرفته و حالا دوباره «جدید» ثبت شده است. اگر ایمپلنت قبلی فیل شده، روی دندان بزنید و دلیل را «کاشت مجدد» بگذارید (فیکسچر رایگان حساب می‌شود). همین‌طور «جدید» ثبت شود؟',ok:'بله، «جدید» ثبت شود',cancel:'برمی‌گردم و اصلاح می‌کنم'}).then(y=>{if(y&&SURG){SURG.m45ack=key;surgSave(t)}});return}}}catch(e){console.error('m45a dup',e)}
  const r=_s.apply(this,arguments);try{if(SURG&&typeof SGP!=='undefined'&&SGP&&SGP.ses){if(SUT[SURG.sut]){SGP.ses.sut=SURG.sut;const b=$('srBody');if(b&&!b.querySelector('.m45r'))b.insertAdjacentHTML('beforeend',`<p class="m45r" style="margin:6px 0 0"><b>بخیه:</b> ${SUT[SURG.sut]}</p>`)}else delete SGP.ses.sut}}catch(e){}return r}}
/* ---- (4) cost far from the plan ---- */
{const _a=api;api=function(action,payload,opt){try{if(action==='surgSave'&&payload&&payload.finish&&SURG&&SURG.id===payload.id&&!payload.m45ok){const a=Number(payload.actual),p=Number(payload.planned)||0,d=a-p;
    if(Number.isFinite(a)&&p>0&&Math.abs(d)>Math.max(0.3*p,5e6)){const self=this,args=arguments;
      return uxAsk({title:'هزینه‌ی جراحی با طرح فرق زیادی دارد',msg:`هزینه‌ی طرح ${fa(p)} تومان و هزینه‌ی کارهای انجام‌شده ${fa(a)} تومان است؛ ${fa(Math.abs(d))} تومان ${d>0?'بیشتر':'کمتر'} از طرح. اگر دندان‌ها و درمان‌های ثبت‌شده درست است ثبت کنید؛ اختلاف برای تسویه به مشاور می‌رود.`,ok:'درست است، ثبت شود',cancel:'برمی‌گردم و نگاه می‌کنم'}).then(y=>{if(!y)throw new Error('ثبت نشد؛ برگه را بازبینی کنید.');payload.m45ok=1;return _a.apply(self,args)})}}}catch(e){console.error('m45a amt',e)}
  const pr=_a.apply(this,arguments);try{if(action==='surgSave'&&payload&&payload.id){const id=payload.id;Promise.resolve(pr).then(()=>{try{localStorage.removeItem(SK(id))}catch(e){}}).catch(()=>{})}}catch(e){}return pr}}
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('button');if(!t||!SURG)return;const d=t.dataset;
  if(d.m45sut){SURG.sut=SURG.sut===d.m45sut?'':d.m45sut;SURG.dirty=true;try{if(SURG.sut)localStorage.setItem(SK(SURG.id),JSON.stringify({d:jalali(new Date()).slash,sut:SURG.sut}));else localStorage.removeItem(SK(SURG.id))}catch(x){}
    const c=document.querySelector('#viewSurg [data-fu="suture"]');if(c&&SURG.sut){const want=SURG.sut==='non';if(c.checked!==want){c.checked=want;c.dispatchEvent(new Event('change',{bubbles:true}))}}sutUI();return}
  if(d.m45gd){gdOpen();return}
  if(d.m45j){GD.j=d.m45j;const i=$('m45GdA');GD.amt=i?num(i.value):GD.amt;const T=gdTar();if(T){const o=gdRow();if(!o||num(o.amt||'')===T*(gdJaw(o)==='B'?2:1)||!GD.amt)GD.amt=T*(GD.j==='B'?2:1)}gdDraw();return}
  if(t.id==='m45GdOk'){GD.amt=num($('m45GdA').value);gdSet(false);return}
  if(t.id==='m45GdDel'){gdSet(true);return}
  if(t.id==='m45GdNo'){$('m45Gd').hidden=true;return}});
/* the patient file shows the suture kind of each session */
{const _r=renderFile;renderFile=function(){const out=_r.apply(this,arguments);try{if(PF&&PF.j&&(PF.tab||'tl')==='tl'){const box=document.querySelector('#pfBody .tl');if(box){const items=[...box.querySelectorAll('.tl-i')];
    (((PF.j.surg||{}).sessions)||[]).forEach(ss=>{if(!SUT[ss.sut])return;const el=items.find(x=>{const b=x.querySelector('b');return b&&b.textContent.trim()===`جلسه‌ی ${fa(ss.n||0)} جراحی`});if(el&&!el.querySelector('.m45s'))el.querySelector('div').insertAdjacentHTML('beforeend',`<p class="m45s">${SUT[ss.sut]}</p>`)})}}}catch(e){}return out}}
window.m45a={dups,gdRow};
})();
