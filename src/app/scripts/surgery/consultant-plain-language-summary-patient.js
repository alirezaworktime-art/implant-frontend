/* ---------- consultant: plain-language summary for the patient ---------- */
function patientSummary(){const r=F,pv=PV(r,1),T=totals(pv),b=effBrand(r),bn=needBrand(r)?(BRANDS.find(x=>x.k===b)||{}).n:'',lines=secLines(r.s);const pt=payText(pv,b);
  const L=[`${r.h.name?r.h.name+' عزیز':'بیمار عزیز'}، سلام. خلاصه‌ی طرح درمان شما در ${SET.clinic||'کلینیک'}:`];
  lines.forEach(l=>L.push('• '+l.t+': '+l.d));
  L.push(`جمع کل${bn?' (برند '+bn+')':''}: ${fa(T.surg[b]+T.pros)} تومان`+(T.pros?` (جراحی ${fa(T.surg[b])} + پروتز ${fa(T.pros)})`:''));
  if(pt.surg)L.push('پرداخت پارت جراحی: '+pt.surg);if(pt.pros)L.push('پرداخت پارت پروتز: '+pt.pros);
  L.push('قیمت‌ها تقریبی است.');if(SET.phone)L.push('هماهنگی: '+SET.phone);return L.join('\n')}

document.addEventListener('click',async e=>{const t=e.target.closest('button,a');if(!t)return;
  if(t.id==='themeBtn'){nextTheme();return}
  if(t.dataset.file!==undefined){openFile(t.dataset.file,t.dataset.fname,t.dataset.ftab,t.dataset.flab);return}
  if(t.id==='pfClose'){$('pfSheet').hidden=true;return}
  if(t.hasAttribute('data-pfclose')){$('pfSheet').hidden=true;return}
  if(t.dataset.lfilt){LFILT=t.dataset.lfilt;renderFilt();renderList();return}
  if(t.id==='sumCopy'){const s=patientSummary();try{await navigator.clipboard.writeText(s);toast('خلاصه‌ی طرح کپی شد؛ در واتس‌اپ یا پیامک بفرستید.')}catch(err){$('sumBox').hidden=false;$('sumTxt').value=s;$('sumTxt').select()}return}
  if(t.id==='sumWa'){const w=waLink(F.h.phone,patientSummary());if(!w){alertMsg('شماره موبایل بیمار وارد نشده.');return}window.open(w,'_blank');return}});
document.addEventListener('input',e=>{if(['rc_nid','rc_phone','rc_name'].includes(e.target.id))rcDupCheck()});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const sh=[...document.querySelectorAll('.sheet:not([hidden])')].pop();if(sh&&sh.id!=='cSheet'&&!busy)sh.hidden=true});

/* ======================= treatment flow: appointments, prosthesis & lab, payments, follow-ups, consent, patient link, dashboard ======================= */
const AKL={surg:'جراحی ایمپلنت',uncover:'آنکاوری',tooth:'دندان نهفته',soft:'بافت نرم',impr:'قالب‌گیری',tryin:'امتحان پروتز',rscr:'امتحان رزین پیچ‌شونده',rabt:'امتحان رزین اباتمنت',deliv:'تحویل کار نهایی',pother:'سایر (پروتز)',chks:'چکاپ جراحی',postop:'پیگیری بعد از جراحی',suture:'کشیدن بخیه',chkp:'چکاپ پروتز',check:'چکاپ دوره‌ای',other:'ویزیت'};
const AGRP={sg:['surg','uncover','tooth','soft'],pr:['impr','tryin','rscr','rabt','deliv','pother'],cs:['chks','postop','suture'],cp:['chkp','check'],ot:['other']},AFL={surg:'ایمپلنت',deliv:'تحویل'};
const apG=k=>AGRP.sg.includes(k)||AGRP.cs.includes(k)?'sg':AGRP.pr.includes(k)||AGRP.cp.includes(k)?'pr':'';
const kGrp=k=>AGRP.sg.includes(k)?'sg':AGRP.pr.includes(k)?'pr':AGRP.cs.includes(k)||AGRP.cp.includes(k)?'ck':'ot';
const TGRP={book:'sg',uncover:'sg',suture:'sg',labready:'pr',pweek:'pr',recall:'ck',fol1:'fl',fol4:'fl',numb:'fl',week:'fl'};
const kDots=its=>{const c={};its.forEach(a=>{const g=kGrp(a.kind);c[g]=(c[g]||0)+1});return ['sg','pr','ck','ot'].filter(g=>c[g]).map(g=>`<i class="kdot k-${g}"></i>`).join('')};
const aDur=k=>k==='surg'?120:k==='tooth'||k==='soft'?60:AGRP.cs.includes(k)||AGRP.cp.includes(k)?20:45;
const PST=[['heal','ترمیم و آنکاوری'],['impr','قالب‌گیری'],['lab','لابراتوار'],['tryin','تست رزین'],['rabt','تست رزین اباتمنت'],['deliv','تحویل روکش نهایی'],['done','تحویل شد']];
const LFOR={tryin:'رزین (برای تست)',rabt:'رزین اباتمنت (برای تست)',deliv:'روکش نهایی'},LFOR_DEF={impr:'tryin',tryin:'rabt',rabt:'deliv',lab:'deliv',heal:'tryin'};
const PSTN=Object.fromEntries(PST);
const LST={new:'سفارش جدید',recv:'دریافت در لابراتوار',making:'در حال ساخت',ready:'آماده؛ ارسال شد',redo:'برگشت برای اصلاح',done:'تحویل بیمار شد',cancel:'لغو شد'};
const LSTC={new:'wait',recv:'rev',making:'rev',ready:'done',redo:'settle',done:'done',cancel:''};
const PAY_K={cash:'نقد',card:'کارت / واریز',chq:'چک'},PAY_ST={ok:['done','دریافت شد'],wait:['wait','در انتظار سررسید'],bounce:['settle','برگشت خورد']};
const UN_WHY=['قیمت','ترس از جراحی','زمان مناسب نیست','مشورت با خانواده','مقایسه با کلینیک دیگر','سایر'];
const canAppt=()=>ROLE==='staff';/* bk1: only reception books */
const canPros=()=>['staff','consultant','doctor','surgery'].includes(ROLE);
const canLab=()=>['doctor','surgery'].includes(ROLE);
const seesMoney=()=>['consultant','manager','staff','accountant'].includes(ROLE);
let QCHQ=[],QUND=[],QAPPT=[];
/* ---- dates: YYYY-MM-DD in Tehran ↔ Jalali ---- */
const dAdd=(d,n)=>{const t=new Date(d+'T12:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)};
const mAdd=(d,n)=>{const t=new Date(d+'T12:00:00Z');t.setUTCMonth(t.getUTCMonth()+n);return t.toISOString().slice(0,10)};
const jDay=d=>{if(!d)return '';try{return jalali(new Date(d+'T12:00:00Z')).slash}catch(e){return d}};
const wDay=d=>{try{return new Intl.DateTimeFormat('fa-IR',{weekday:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return ''}};
const wDayS=d=>{try{return new Intl.DateTimeFormat('fa-IR',{weekday:'short',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return ''}};
function j2g(jy,jm,jd){jy+=1595;let days=-355668+(365*jy)+(~~(jy/33)*8)+~~(((jy%33)+3)/4)+jd+((jm<7)?(jm-1)*31:((jm-7)*30)+186);let gy=400*~~(days/146097);days%=146097;if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++}gy+=4*~~(days/1461);days%=1461;if(days>365){gy+=~~((days-1)/365);days=(days-1)%365}let gd=days+1;const sal=[0,31,((gy%4===0&&gy%100!==0)||(gy%400===0))?29:28,31,30,31,30,31,31,30,31,30,31];let gm=0;for(gm=0;gm<13&&gd>sal[gm];gm++)gd-=sal[gm];return [gy,gm,gd]}
function parseJ(s){const m=toEn(s||'').trim().match(/^(\d{2,4})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{1,2})$/);if(!m)return '';let y=+m[1];if(y<100)y+=1400;const mo=+m[2],d=+m[3];if(mo<1||mo>12||d<1||d>31||(mo>6&&d>30))return '';
  const [gy,gm,gd]=j2g(y,mo,d),iso=`${gy}-${String(gm).padStart(2,'0')}-${String(gd).padStart(2,'0')}`;const back=toEn(jDay(iso)).split('/').map(Number);return back[0]===y&&back[1]===mo&&back[2]===d?iso:''}
function dayHint(iso){if(!iso)return '';const n=dDiff(iso,tDay());return wDay(iso)+' · '+(n===0?'امروز':n===1?'فردا':n===-1?'دیروز':n>0?fa(n)+' روز دیگر':fa(-n)+' روز پیش')}
const JMN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const money=n=>fa(n)+' تومان';

