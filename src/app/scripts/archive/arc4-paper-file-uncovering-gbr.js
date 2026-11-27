/* ---------- arc4: paper file — uncovering and GBR by count, cost of the chosen works by the tariffs, payments only when editing;
   surgery-day treatment lists stay below the header / tiles while scrolling ---------- */
let ARC_UNC=null;
function arcUncPrice(){if(ARC_UNC!==null)return Promise.resolve(ARC_UNC);return api('finCatalog').then(j=>{const s=(j.svc||[]).find(x=>x.active!==0&&/آ?نکاوری/.test(x.name||''));ARC_UNC=s?Number(s.price)||0:0;return ARC_UNC}).catch(()=>{ARC_UNC=0;return 0})}
function arcSesCost(c){const P=blankSections(),S=secFrom(secDoc(c.s)),b='ko';SECTIONS.forEach(x=>{S[x.id].price=P[x.id].price;S[x.id].bp={...P[x.id].bp};S[x.id].ip={...P[x.id].ip}});
  const T=totals({s:S,brand:b,pay:{}}),impRow=rowTotals({s:S,brand:b},SEC.imp).brand[b];let imp=0;
  Object.keys(S.imp.sel).filter(k=>S.imp.sel[k]&&isTooth(k)).forEach(k=>{const g=(c.imp[k]&&c.imp[k].g)||b;imp+=num(P.imp.bp[g]||P.imp.bp[b])});
  ['U','L'].forEach(j=>imp+=num(S.imp.jc[j])*num(P.imp.bp[b]));
  const work=T.surg[b]+T.pros-impRow+imp,unc=num(c.uncN)*(ARC_UNC||0);return {work,unc,all:work+unc}}
function arcCostAll(){const A=SURG&&SURG.arc;if(!A)return {rows:[],tot:0};const rows=A.ses.map((c,i)=>Object.assign({i,c},arcSesCost(c))).filter(r=>r.all>0||num(r.c.uncN));return {rows,tot:rows.reduce((a,r)=>a+r.all,0)}}
function arcCostUpd(){const el=$('arcCost');if(!el||!SURG||!SURG.arc)return;const {rows,tot}=arcCostAll();
  el.innerHTML=`<h3>هزینه‌ی کل بیمار (بر اساس تعرفه‌ها و کارهای انتخاب‌شده)</h3>${rows.length?`<table class="arcct"><tbody>${rows.map(r=>`<tr><td>جلسه‌ی ${fa(r.i+1)}${r.c.dayJ?' · '+esc(faD(r.c.dayJ)):''}</td><td>${fa(r.work)}</td></tr>${num(r.c.uncN)?`<tr><td>انکاوری ${fa(num(r.c.uncN))} عدد${ARC_UNC?' × '+fa(ARC_UNC):' (تعرفه‌ی انکاوری در خدمات حسابداری تعریف نشده)'}</td><td>${fa(r.unc)}</td></tr>`:''}`).join('')}</tbody><tfoot><tr><td>جمع کل</td><td>${fa(tot)} تومان</td></tr></tfoot></table>`:'<p class="note">هنوز کاری علامت نخورده.</p>'}
  <p class="note">${FXA&&FXA.id?'پرداخت‌ها را پایین همین صفحه یا در «مالی بیماران» اصلاح کنید.':'پرداخت‌های بیمار را بعد از ثبت، در «مالی بیماران» یا با «ویرایش» همین پرونده وارد کنید.'}</p>`}
{const _b=arcBar;arcBar=function(){const r=_b.apply(this,arguments);try{const A=SURG&&SURG.arc,c=A&&A.ses[A.cur];if(c&&$('arc_unc')&&document.activeElement!==$('arc_unc'))$('arc_unc').value=num(c.uncN)?faD(String(num(c.uncN))):''}catch(e){}arcCostUpd();return r}}
{const _s=arcStash;arcStash=function(){const r=_s.apply(this,arguments);const A=SURG&&SURG.arc,c=A&&A.ses[A.cur];if(c&&$('arc_unc'))c.uncN=Math.min(40,num(toEn($('arc_unc').value)));return r}}
{const _r=arcRender;arcRender=function(){const r=_r.apply(this,arguments);try{const s=$('fxArcSheet'),i=s&&s.firstElementChild;if(i&&!$('arcCost'))i.insertAdjacentHTML('afterbegin','<div id="arcCost" class="arccost"></div>');
  if(FXA&&!FXA.id){const v=$('fx2Vis');if(v){const box=[v.previousElementSibling,v.previousElementSibling&&v.previousElementSibling.previousElementSibling,v.previousElementSibling&&v.previousElementSibling.previousElementSibling&&v.previousElementSibling.previousElementSibling.previousElementSibling].filter(Boolean);
    box.concat([v,$('fx2VAdd'),$('fx2Sum')]).forEach(el=>{if(el&&el.tagName!=='DATALIST')el.hidden=true})}const hh=i&&i.querySelector('h2');if(hh)hh.textContent='وضعیت پرونده'}}catch(e){}
  arcUncPrice().then(arcCostUpd);arcCostUpd();return r}}
['click','change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(SURG&&SURG.arc&&e.target.closest&&e.target.closest('#viewSurg,#impSheet'))setTimeout(()=>{if(e.target.id==='arc_unc'){const A=SURG.arc,c=A.ses[A.cur];if(c)c.uncN=Math.min(40,num(toEn(e.target.value)))}arcCostUpd()},0)}));
/* surgery-day lists: below the app bar on a phone, below the tiles on a computer */
function sgPickTop(){const v=$('viewSurg');if(!v||v.hidden)return;const ab=document.querySelector('.appbar'),Z=window.ZM?ZM():1,hb=ab?ab.getBoundingClientRect().bottom:0,mob=matchMedia('(max-width:720px)').matches;
  document.querySelectorAll('#viewSurg .sgpick').forEach(el=>{if(mob){el.style.top=Math.max(0,hb)/Z+'px';el.style.maxHeight='';return}
    const t=$('tiles'),tb=t&&!t.hidden&&t.offsetParent?t.getBoundingClientRect().bottom:0,top=Math.max(hb+8,tb+8,84*Z);el.style.top=top/Z+'px';el.style.maxHeight=Math.max(160,innerHeight-top-12)/Z+'px'})}
addEventListener('scroll',()=>requestAnimationFrame(sgPickTop),{passive:true});addEventListener('resize',sgPickTop);
{const _rs=renderSurg;renderSurg=function(){const r=_rs.apply(this,arguments);sgPickTop();return r}}

