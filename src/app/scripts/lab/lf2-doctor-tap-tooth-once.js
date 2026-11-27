
/* ---------- lf2: «تعامل لابراتوار و پزشک» — doctor: tap a tooth once = abutment, twice = pontic, three times = off; lab: cause «سایر» must be typed ---------- */
/* (also fixes lf1: fa() on a list of teeth printed «ناعدد»; faD converts digits only) */
const lf2Pt=c=>{const pt=c.pt||{},T=c.teeth||[];if(!c.pt)return faD(T.join('، '));const a=T.filter(t=>pt[t]!=='p'),p=T.filter(t=>pt[t]==='p');return [a.length?'پایه '+faD(a.join('، ')):'',p.length?'پونتیک '+faD(p.join('، ')):''].filter(Boolean).join(' · ')};
/* form: the three-tap cycle */
window.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('[data-lft]');if(!t||!LF.f||!$('lfRoot')||!$('lfRoot').contains(t))return;e.preventDefault();e.stopImmediatePropagation();
  const f=LF.f,n=+t.dataset.lft;f.pt=f.pt||{};if(!f.teeth.includes(n)){f.teeth=f.teeth.concat(n);f.pt[n]='a'}else if(f.pt[n]!=='p')f.pt[n]='p';else{f.teeth=f.teeth.filter(x=>x!==n);delete f.pt[n]}lfTeethPaint()},true);
{const _p=lfTeethPaint;lfTeethPaint=function(){_p.apply(this,arguments);const f=LF.f;if(!f)return;f.pt=f.pt||{};Object.keys(f.pt).forEach(k=>{if(!f.teeth.includes(+k))delete f.pt[k]});f.teeth.forEach(n=>{if(!f.pt[n])f.pt[n]='a'});
  document.querySelectorAll('[data-lft]').forEach(b=>{const n=+b.dataset.lft,on=f.teeth.includes(n);b.classList.toggle('lfpa',on&&f.pt[n]!=='p');b.classList.toggle('lfpp',on&&f.pt[n]==='p');b.title=on?(f.pt[n]==='p'?'پونتیک':'پایه'):''});
  const s=$('lf2Sum');if(s)s.textContent=f.teeth.length?lf2Pt({teeth:f.teeth.slice().sort((a,b)=>a-b),pt:f.pt}):'هنوز دندانی انتخاب نشده'}}
{const _f=lfFormHTML;lfFormHTML=function(){let h=_f.apply(this,arguments);return h.replace('<span>شماره‌ی دندان (FDI)</span>','<span>شماره‌ی دندان (FDI) — یک ضربه <b class="lf2a">پایه</b>، دو ضربه <b class="lf2p">پونتیک</b>، سه ضربه برداشتن</span><p class="note lf2s" id="lf2Sum"></p>')}}
/* list, case and copy: abutments and pontics apart */
{const _r=lfRow;lfRow=function(c){let h=_r.apply(this,arguments);if(c)h=h.replace('دندان '+fa((c.teeth||[]).join('، ')),(c.pt?'':'دندان ')+esc(lf2Pt(c)));return h}}
{const _d=lfDetailHTML;lfDetailHTML=function(c){let h=_d.apply(this,arguments);if(c)h=h.replace('<dt>دندان‌ها</dt><dd>'+esc(fa((c.teeth||[]).join('، ')))+'</dd>','<dt>دندان‌ها</dt><dd>'+esc(lf2Pt(c))+'</dd>');return h}}
lfSummary=function(c){return [`پرونده‌ی ${c.no} — ${LF_ST[c.st]||''}`,`کلینیک: ${c.clinic}`,`بیمار: ${c.patient}`,`نوع کار: ${c.part} · ایراد: ${c.issue}`,`دندان‌ها: ${lf2Pt(c)}`,`توضیح: ${c.desc||''}`].join('\n')};
lfXl=function(){const L=lfSegList();const head=['شماره','تاریخ ثبت','کلینیک','بیمار','نوع کار','نوع ایراد','پایه','پونتیک','اولویت','وضعیت','علت اصلی','شرح علت (سایر)','نتیجه','تأیید پزشک','آخرین تغییر','توضیح پزشک'];
  const rows=L.map(c=>{const pt=c.pt||{},T=c.teeth||[];return [c.no,jt(c.at),c.clinic,c.patient,c.part,c.issue,T.filter(t=>pt[t]!=='p').join('، '),T.filter(t=>pt[t]==='p').join('، '),c.pri==='urgent'?'فوری':'عادی',LF_ST[c.st]||'',c.cause||'',c.causeTxt||'',c.outcome||'',c.verdict==='ok'?'بله':'',jt(c.upd),c.desc||'']});
  xlsx([{title:'تعامل لابراتوار و پزشک',sub:'تهیه‌شده '+jt(new Date().toISOString()),head,rows}],'lab-feedback-'+tDay()+'.xlsx')};
/* lab: «سایر» needs the cause typed */
{const _a=lfActHTML;lfActHTML=function(c,ls){let h=_a.apply(this,arguments);try{const a=LF.a;if(ROLE==='lflab'&&c.st==='lab'&&a&&a.cause==='سایر'){const i=h.indexOf('</div></div>',h.indexOf('data-lfch="cause"'));
  if(i>0)h=h.slice(0,i+12)+`<div class="fields"><label class="f">علت را بنویسید *<input id="lf2Cause" maxlength="200" value="${esc(a.causeTxt||'')}" autocomplete="off" placeholder="علت ایراد چه بود؟"></label></div>`+h.slice(i+12)}}catch(e){}return h}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-lfch="cause"] [data-lfc]');if(!t||!LF.a||!LF.open)return;const sc=window.scrollY;lfRender();window.scrollTo(0,sc);if(LF.a.cause==='سایر'){const i=$('lf2Cause');if(i)i.focus()}});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='lf2Cause'&&LF.a)LF.a.causeTxt=e.target.value});
{const _d=lfDoAct;lfDoAct=async function(btn){const a=LF.a;if(ROLE==='lflab'&&a&&a.cause==='سایر'&&!String(a.causeTxt||'').trim()){const m=$('lfAMsg');m.className='msg err';m.textContent='علت «سایر» را بنویسید.';const i=$('lf2Cause');if(i)i.focus();return}return _d.apply(this,arguments)}}
{const _a=api;api=function(action,payload,opt){try{if(action==='lf'&&payload&&payload.op==='act'&&LF.a&&LF.a.cause==='سایر')payload.causeTxt=String(LF.a.causeTxt||'').trim()}catch(e){}return _a.apply(this,arguments)}}
/* history: the typed cause next to «سایر» */
{const _r=lfRender;lfRender=function(){const r=_r.apply(this,arguments);try{if(LF.open){const c=lfCases().find(x=>x.id===LF.open);const li=document.querySelectorAll('.lfth > li');(c&&c.thread||[]).forEach((e,i)=>{if(e.causeTxt&&li[i]){const b=li[i].querySelector('.lfem b');if(b&&!b.dataset.lf2){b.dataset.lf2='1';b.textContent=e.cause+' — '+e.causeTxt}}})}}catch(e){}return r}}
