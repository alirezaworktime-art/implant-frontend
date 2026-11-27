
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fa=n=>Math.round(Number(n)||0).toLocaleString('fa-IR');
const faD=s=>String(s??'').replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const jd=d=>{try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
const wd=d=>{try{return new Intl.DateTimeFormat('fa-IR',{weekday:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return ''}};
const AKL={visit:'ویزیت اولیه',postop:'ویزیت بعد جراحی',surg:'جراحی',uncover:'آنکاوری',impr:'قالب‌گیری',tryin:'تست رزین',deliv:'تحویل روکش',suture:'کشیدن بخیه',check:'چکاپ دوره‌ای',other:'ویزیت',tooth:'جراحی دندان نهفته',soft:'جراحی بافت نرم',rscr:'تست رزین پیچ‌شونده',rabt:'تست رزین اباتمنت',chks:'چکاپ جراحی',chkp:'چکاپ پروتز'};
const PSL={tmpd:'روکش موقت',tmpx:'پروتز موقت',heal:'ترمیم و جوش خوردن',impr:'قالب‌گیری',jig:'تست جیگ',lab:'ساخت پروتز',rabt:'امتحان رزین اباتمنت',frame:'امتحان فریم',bite:'ثبت بایت',tryin:'امتحان پروتز',deliv:'تحویل پروتز'};
const PPATH={fix:['heal','impr','tryin','rabt','deliv'],tmp1:['tmpd','heal','impr','tryin','rabt','deliv'],aox:['tmpx','heal','impr','jig','frame','tryin','deliv'],ovd:['heal','impr','bite','tryin','deliv']};/* fix7c: B1 */const f7cI=(P,j)=>{const ix=s=>P.findIndex(x=>x[0]===s);if(j.pros==='lab'){const a=j.prosAfter&&ix(j.prosAfter);return a>=0?a:ix('impr')+1}const k=ix(j.pros);return k>=0?k:(['rabt','frame','jig','bite'].includes(j.pros)?ix('tryin'):-1)};
const PST=Object.keys(PSL).map(k=>[k,PSL[k]]);
const tok=(location.hash||'').slice(1).trim();
async function go(){const el=$('app');
  if(!/^[0-9a-f]{36}$/.test(tok)){el.innerHTML='<div class="empty">لینک کامل نیست. لطفاً لینک را دوباره از پیام کلینیک باز کنید.</div>';return}
  let j;try{const r=await fetch(location.origin+'/',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'patient',tok})});j=await r.json()}catch(e){el.innerHTML='<div class="empty">اتصال برقرار نشد. اینترنت را بررسی کنید و صفحه را دوباره باز کنید.</div>';return}
  if(!j.ok){el.innerHTML=`<div class="empty">${esc(j.error||'خطا')}</div>`;return}
  document.title='پرونده‌ی درمان · '+(j.clinic||'');const S=j.snap||{},td=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran'}).format(new Date());
  let h=`<header><img src="icon-192.png" alt=""><div><h1>${esc(j.name)} عزیز، خوش آمدید</h1><p>${esc(j.clinic||'')}${j.doctor?' · '+esc(j.doctor):''}</p></div></header>`;
  // next appointments
  h+=`<section class="card"><h2>نوبت‌های بعدی شما</h2>${(j.appts||[]).length?j.appts.map(a=>`<div class="row"><span>${esc(AKL[a.kind]||'ویزیت')}</span><b>${esc(wd(a.day))} ${esc(jd(a.day))} · ساعت ${faD(a.time)}</b></div>`).join(''):'<div class="muted">فعلاً نوبتی ثبت نشده است.</div>'}</section>`;
  // treatment progress
  if(j.pros){const PST=(PPATH[j.prosType]||PPATH.fix).map(s=>[s,PSL[s]]),i=f7cI(PST,j);h+=`<section class="card"><h2>مرحله‌ی درمان پروتز</h2>${j.pros==='pause'?'<p>درمان پروتز شما فعلاً متوقف است؛ هر وقت آماده بودید با کلینیک تماس بگیرید.</p>':j.pros==='fail'?'<p>کلینیک برای ادامه‌ی درمان با شما تماس می‌گیرد.</p>':j.pros==='done'?'<p>پروتز شما تحویل شده است. برای ماندگاری ایمپلنت‌ها، چکاپ‌های دوره‌ای را فراموش نکنید.</p>':`<div class="steps">${PST.map((s,k)=>`<span class="${k===i?'on':k<i?'past':''}">${s[1]}</span>`).join('')}</div>`}${j.recall?`<p class="muted">چکاپ بعدی: ${esc(jd(j.recall))}</p>`:''}</section>`}
  else if(j.surgDone)h+=`<section class="card"><h2>مرحله‌ی درمان</h2><p>جراحی شما انجام شده است.</p></section>`;
  if(j.rx&&(j.rx.items||[]).length)h+=`<section class="card"><h2>دستورات بعد از جراحی و نسخه‌ی شما${j.rx.at?` <span class="muted">(${esc(jd(String(j.rx.at).slice(0,10)))})</span>`:''}</h2>${j.rx.items.map(x=>`<p style="margin:10px 0 2px"><b>${esc(x.title)}</b></p><ul>${String(x.text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`).join('')}</section>`;
  // plan
  if((S.lines||[]).length){h+=`<section class="card"><h2>خلاصه‌ی طرح درمان${j.jalali?` <span class="muted">(تأیید ${esc(faD(j.jalali))})</span>`:''}</h2><ul>${S.lines.map(l=>`<li><b>${esc(l.t)}:</b> ${esc(l.d)}</li>`).join('')}</ul>${S.brand?`<p class="muted">برند ایمپلنت: ${esc(S.brand)}</p>`:''}
    ${S.total?`<div class="row"><span>جمع کل درمان</span><span class="big">${fa(S.total)} تومان</span></div>`:''}${S.pros&&S.surg?`<div class="row"><span class="muted">جراحی ${fa(S.surg)} + پروتز ${fa(S.pros)}</span></div>`:''}
    ${S.pay&&(S.pay.surg||S.pay.pros)?`<p class="muted">${S.pay.surg?'پرداخت پارت جراحی: '+esc(S.pay.surg):''}${S.pay.pros?'<br>پرداخت پارت پروتز: '+esc(S.pay.pros):''}</p>`:''}<p class="muted">قیمت‌ها تقریبی است.</p></section>`}
  // payments
  const P=(j.pays||[]).filter(p=>p.st!=='del'),TOT=Number(j.total)||S.total||0;if(P.length||TOT){const got=P.filter(p=>p.st==='ok'||(p.kind==='chq'&&p.st==='wait')/* fix7d R11: a cheque in hand counts as paid, like the file */).reduce((a,p)=>a+p.amount,0)-(Number(j.refunded)||0),chq=P.filter(p=>p.kind==='chq'&&p.st!=='ok');
    h+=`<section class="card"><h2>پرداخت‌ها</h2><div class="row"><span>پرداخت‌شده (با چک‌های در انتظار)</span><b>${fa(got)} تومان</b></div>${TOT?`<div class="row"><span>باقی‌مانده (تقریبی)</span><b>${fa(Math.max(0,TOT-got))} تومان</b></div>`:''}
      ${chq.length?`<h2 style="margin-top:12px">چک‌های شما</h2>${chq.map(p=>`<div class="row"><span>${esc(jd(p.due))}${p.due<td&&p.st==='wait'?' <span class="pill bad">سررسید گذشته</span>':''}${p.st==='bounce'?' <span class="pill bad">برگشت خورده</span>':''}</span><b>${fa(p.amount)} تومان</b></div>`).join('')}`:''}</section>`}
  if(j.phone)h+=`<a class="call" href="tel:${esc(String(j.phone).replace(/[^\d+]/g,''))}">تماس با کلینیک: ${esc(faD(j.phone))}</a>`;
  h+=`<p class="muted" style="text-align:center;margin-top:16px">این صفحه فقط برای شماست؛ لینک را برای دیگران نفرستید.</p>`;
  el.innerHTML=h}
go();
