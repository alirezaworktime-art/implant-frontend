/* ---------- manager dashboard ---------- */
const DASH={data:null,per:'m1'};
async function loadDash(){try{const j=await api('stats',{},{timeout:20000});DASH.data=j;renderDash()}catch(e){if(e.message!=='aborted')$('dBody').innerHTML=`<div class="empty">${esc(e.message)}</div>`}}
const jKey=iso=>{if(!iso)return '';const s=toEn(jalali(new Date(iso.length===10?iso+'T12:00:00Z':iso)).slash);return s.slice(0,7)};
function perStart(per){const td=tDay(),k=toEn(jDay(td)).split('/').map(Number);if(per==='all')return '';let y=k[0],m=k[1]-(per==='m1'?0:per==='m3'?2:11);while(m<1){m+=12;y--}return parseJ(`${y}/${m}/1`)}
function renderDash(){const D=DASH.data;if(!D)return;const from=perStart(DASH.per),td=D.today||tDay(),inP=iso=>iso&&(!from||String(iso).slice(0,10)>=from),P=D.plans;
  const appr=P.filter(p=>(p.st==='confirmed'||p.st==='modified')&&inP(p.d||p.c)),created=P.filter(p=>inP(p.c));
  const val=appr.reduce((a,p)=>a+p.t,0),imp=P.filter(p=>inP(p.s1)).reduce((a,p)=>a+p.imp,0);
  const okPay=D.pays.filter(p=>p.st==='ok'),payDay=p=>p.kind==='chq'?p.due:String(p.at).slice(0,10);
  const recv=okPay.filter(p=>inP(payDay(p))).reduce((a,p)=>a+(+p.amount||0),0);
  const allConf=P.filter(p=>p.st==='confirmed'||p.st==='modified'),owed=allConf.reduce((a,p)=>a+p.t+(p.diff||0),0),gotAll=okPay.reduce((a,p)=>a+(+p.amount||0),0);
  const chqWait=D.pays.filter(p=>p.kind==='chq'&&p.st==='wait'),chqLate=chqWait.filter(p=>p.due<td),chqWaitSum=chqWait.reduce((a,p)=>a+(+p.amount||0),0);
  const labOpen=D.labs.filter(l=>!['done','cancel'].includes(l.st)),labLate=labOpen.filter(l=>l.due&&l.due<td&&l.st!=='ready');
  const conv=created.length?Math.round(100*created.filter(p=>p.st==='confirmed'||p.st==='modified').length/created.length):0;
  const K=(l,v,s,c)=>`<div class="kpi big${c?' '+c:''}"><b>${v}</b><span>${l}</span>${s?`<span class="sub">${s}</span>`:''}</div>`;
  let h=`<div class="dgrid">${K('بیمار پذیرش‌شده',fa(created.length))}${K('طرح تأییدشده',fa(appr.length),'نرخ تأیید '+fa(conv)+'٪ از پذیرش‌شده‌ها')}${K('ارزش طرح‌های تأییدشده',fa(val),'تومان')}${K('ایمپلنت کارگذاشته',fa(imp))}
    ${K('دریافتی (نقد، کارت، چک وصول‌شده)',fa(recv),'تومان')}${K('طلب از بیماران',fa(Math.max(0,owed-gotAll-chqWaitSum)),'به‌جز '+fa(chqWaitSum)+' چک در جریان')}${K('چک سررسیدگذشته',fa(chqLate.length),fa(chqLate.reduce((a,p)=>a+(+p.amount||0),0))+' تومان',chqLate.length?'bad':'')}${K('سفارش باز لابراتوار',fa(labOpen.length),labLate.length?fa(labLate.length)+' مورد دیرکرد':'بدون دیرکرد',labLate.length?'warn':'')}</div>`;
  // monthly bars (approved value vs received), last 6 or 12 Jalali months
  const narrow=innerWidth<600,nM=(DASH.per==='m12'||DASH.per==='all')&&!narrow?12:6,cur=toEn(jDay(td)).split('/').map(Number),months=[];let y=cur[0],m=cur[1];for(let i=0;i<nM;i++){months.unshift(`${y}/${String(m).padStart(2,'0')}`);m--;if(m<1){m=12;y--}}
  const mv=months.map(k=>({k,a:allConf.filter(p=>jKey(p.d||p.c)===k).reduce((s,p)=>s+p.t,0),r:okPay.filter(p=>jKey(payDay(p))===k).reduce((s,p)=>s+(+p.amount||0),0)}));
  const mx=Math.max(1,...mv.map(x=>Math.max(x.a,x.r))),W=narrow?360:640,H=narrow?200:220,pl=8,pb=26,bw=(W-pl*2)/nM,hb=Math.min(22,bw/2-4);
  const ys=v=>H-pb-(v/mx)*(H-pb-14);
  const svg=`<svg class="mchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="ارزش طرح‌های تأییدشده و دریافتی ماهانه">${[0.25,0.5,0.75,1].map(f=>`<line class="gl" x1="0" x2="${W}" y1="${ys(mx*f)}" y2="${ys(mx*f)}"/>`).join('')}<line class="gl" x1="0" x2="${W}" y1="${H-pb}" y2="${H-pb}"/>
    ${mv.map((x,i)=>{const cx0=W-pl-(i+.5)*bw;const r1=x.a?`<path class="bar" fill="var(--s1)" d="${barPath(cx0+1+hb,ys(x.a),hb,H-pb)}" data-tip="${esc(JMN[+x.k.slice(5)-1]+' — تأییدشده: '+fa(x.a)+' تومان')}"/>`:'',r2=x.r?`<path class="bar" fill="var(--s2)" d="${barPath(cx0-1,ys(x.r),hb,H-pb)}" data-tip="${esc(JMN[+x.k.slice(5)-1]+' — دریافتی: '+fa(x.r)+' تومان')}"/>`:'';
      return r1+r2+`<text x="${cx0}" y="${H-8}" text-anchor="middle">${JMN[+x.k.slice(5)-1]}</text>`}).join('')}</svg>`;
  h+=`<div class="dcards"><section class="card wide"><h2>ماه به ماه (تومان)</h2><div class="legend2"><span><i style="background:var(--s1)"></i>ارزش طرح‌های تأییدشده</span><span><i style="background:var(--s2)"></i>دریافتی</span></div>${svg}
    <details><summary class="note">جدول</summary><table class="dtable"><tr><th>ماه</th><th>تأییدشده</th><th>دریافتی</th></tr>${mv.map(x=>`<tr><td>${JMN[+x.k.slice(5)-1]} ${faD(x.k.slice(0,4))}</td><td>${fa(x.a)}</td><td>${fa(x.r)}</td></tr>`).join('')}</table></details></section>`;
  const hb2=(rows,fmt)=>{const mx2=Math.max(1,...rows.map(r=>r[1]));return rows.length?`<div class="hbars">${rows.map(([l,v,s])=>`<div class="hbar"><span>${esc(l)}</span><span class="tr"><i style="width:${Math.max(2,100*v/mx2)}%"></i></span><span class="v">${fmt(v)}${s?` <small class="note">${s}</small>`:''}</span></div>`).join('')}</div>`:'<div class="empty">داده‌ای در این بازه نیست.</div>'};
  const fun=[['پذیرش',created.length],['طرح پزشک',created.filter(p=>p.st!=='queued').length],['تأیید بیمار',created.filter(p=>p.st==='confirmed'||p.st==='modified').length],['جراحی',created.filter(p=>p.sn>0).length],['تحویل پروتز',created.filter(p=>p.ps==='done').length]];
  h+=`<section class="card funnel"><h2>مسیر بیماران پذیرش‌شده</h2>${hb2(fun,v=>fa(v))}</section>`;
  const grp=(arr,key,lbl)=>{const g={};arr.forEach(p=>{const k=key(p)||'';g[k]=g[k]||[0,0];g[k][0]+=p.t;g[k][1]++});return Object.keys(g).map(k=>[lbl(k),g[k][0],fa(g[k][1])+' طرح']).sort((a,b)=>b[1]-a[1])};
  h+=`<section class="card"><h2>ارزش تأییدشده به تفکیک برند</h2>${hb2(grp(appr,p=>p.b,k=>(BRANDS.find(b=>b.k===k)||{}).n||'بدون برند / ارجاع'),v=>fa(v))}</section>`;
  h+=`<section class="card"><h2>به تفکیک پزشک</h2>${hb2(grp(appr,p=>p.doc,k=>k||'نامشخص'),v=>fa(v))}</section>`;
  const cnt=(arr,key,lbl)=>{const g={};arr.forEach(p=>{const k=key(p)||'';g[k]=(g[k]||0)+1});return Object.keys(g).map(k=>[lbl(k),g[k]]).sort((a,b)=>b[1]-a[1]).slice(0,10)};
  h+=`<section class="card"><h2>بیماران به تفکیک معرف</h2>${hb2(cnt(created,p=>p.ref,k=>k||'نامشخص'),v=>fa(v)+' بیمار')}</section>`;
  h+=`<section class="card"><h2>بیماران به تفکیک شهر</h2>${hb2(cnt(created,p=>p.city,k=>k||'نامشخص'),v=>fa(v)+' بیمار')}</section>`;
  const why={};P.filter(p=>p.lr&&inP(p.la)).forEach(p=>why[p.lr]=(why[p.lr]||0)+1);
  h+=`<section class="card"><h2>دلیل تأیید نکردن طرح</h2>${hb2(Object.keys(why).map(k=>[k,why[k]]).sort((a,b)=>b[1]-a[1]),v=>fa(v)+' بیمار')}</section>`;
  const nm=Object.fromEntries(P.map(p=>[p.id,p]));
  h+=`<section class="card"><h2>چک‌های سررسیدگذشته</h2>${chqLate.length?chqLate.slice(0,20).map(p=>`<div class="prow"><span>${esc(jDay(p.due))}</span><span class="amt">${fa(p.amount)}</span><button class="btn sm ghost" type="button" data-file="${esc(p.plan)}" data-fname="" data-ftab="pay">پرونده</button></div>`).join(''):'<div class="empty">چک سررسیدگذشته‌ای نیست.</div>'}</section>`;
  h+=`<section class="card"><h2>دیرکرد لابراتوار</h2>${labLate.length?labLate.map(l=>`<div class="prow"><span>${esc(l.name)}</span><span class="late">${esc(jDay(l.due))}</span><button class="btn sm ghost" type="button" data-file="${esc(l.plan)}" data-fname="${esc(l.name)}" data-ftab="pros">پرونده</button></div>`).join(''):'<div class="empty">سفارشی دیرکرد ندارد.</div>'}</section></div>`;
  $('dBody').innerHTML=h;$('dAt').textContent='به‌روزرسانی: '+jt(D.at)+' · مبالغ بر اساس جمع طرح در برند انتخابی بیمار است.';void nm}
function barPath(x,y,w,base){const h=base-y,r=Math.min(4,h,w/2);return `M${x-w} ${base}V${y+r}Q${x-w} ${y} ${x-w+r} ${y}H${x-r}Q${x} ${y} ${x} ${y+r}V${base}Z`}
(function(){let tip=null;document.addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('[data-tip]');if(!b){if(tip)tip.hidden=true;return}if(!tip){tip=document.createElement('div');tip.className='dtip';document.body.appendChild(tip)}tip.textContent=b.dataset.tip;tip.hidden=false;const r=b.getBoundingClientRect(),Z=(window.ZM?ZM():1),tw=tip.offsetWidth*Z;tip.style.left=Math.max(8,Math.min(innerWidth-tw-8,r.left+r.width/2-tw/2))/Z+'px';tip.style.top=Math.max(8,r.top-38*Z)/Z+'px'})})();

/* phone / browser Back: close the open window, or go to the previous page of the site, instead of leaving the site */
(function(){const VS=[],TAB={queue:'tabQueue',recep:'tabRecep',list:'tabList',cal:'tabCal',pros:'tabPros',pday:'tabPday',users:'tabUsers',wb:'tabWb',acc:'tabAcc',rx:'tabRx',fin:'tabFin',lab:'tabLab',dash:'tabDash',inv:'tabInv'};let cur=null,skip=false,exitAt=0,dirtyAt=0;
  const _show=show;show=function(v){if(v==='login')VS.length=0;else if(!skip&&cur&&cur!==v&&cur!=='login'){VS.push(cur);if(VS.length>30)VS.shift()}cur=v;return _show.apply(this,arguments)};
  let armed=false;const arm=()=>{if(armed||!ROLE)return;try{history.pushState({ipk:Date.now()},'');armed=true}catch(e){}};
  ['click','pointerup','keydown'].forEach(ev=>addEventListener(ev,arm,true));
  function closeSheet(sh){if(sh.id==='cSheet'&&typeof busy!=='undefined'&&busy)return;const B=[...sh.querySelectorAll('button')].filter(x=>!x.disabled&&!x.hidden&&x.offsetParent!==null),b=B.find(x=>/(Close|Cancel|No)$/.test(x.id))||B.find(x=>/^(بستن|انصراف|بازگشت)/.test((x.textContent||'').trim()));if(b)b.click();if(!sh.hidden)sh.hidden=true}
  function back(){const sh=[...document.querySelectorAll('.sheet:not([hidden])')].map((x,i)=>[x,(+getComputedStyle(x).zIndex||0)*1000+i]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]).pop();if(sh){closeSheet(sh);return true}
    const d=document.querySelector('details.more[open]');if(d){d.open=false;return true}
    if(!ROLE||!cur||cur==='login')return false;
    if(cur==='form'&&dirty){if(F&&F.id){try{ldSave()}catch(e){}dirty=false;toast('تغییرات این فرم روی همین دستگاه نگه داشته شد؛ با باز کردن دوباره‌ی بیمار برمی‌گردد.')}else{if(Date.now()-dirtyAt>4000){dirtyAt=Date.now();toast('این فرم هنوز ذخیره نشده. برای خروج از فرم دوباره «برگشت» را بزنید.',true);return true}dirty=false}}
    while(VS.length){const v=VS.pop();if(v===cur||v==='form'||v==='surg'||v==='login')continue;const t=$(TAB[v]);if(!t||t.hidden)continue;skip=true;try{t.click()}finally{skip=false}cur=v;return true}
    if(cur==='form'||cur==='surg'){skip=true;try{home()}finally{skip=false}return true}
    toast('برای خروج از سایت دوباره «برگشت» را بزنید.');return true}
  // a Back entry is re-added on the next tap (browsers skip entries added without a tap), so a 2nd Back at home leaves the site
  addEventListener('popstate',()=>{armed=false;back()})})();
/* ux2: doctor/consultant see a short patient summary (filled by reception) and go straight to the treatment sections */
let POPEN=null;
function pSumRender(){const c=$('pCard');if(!c)return;const h=F.h||{},on=(ROLE==='doctor'||ROLE==='consultant')&&!!String(h.name||'').trim()&&POPEN!==(F.id||'new');c.classList.toggle('pcol',on);if(!on)return;
  const L=medList(F.med),info=[h.pOnly?'⚑ فقط پروتز (ایمپلنت در جای دیگر)':'',h.age?'سن '+faD(h.age):'',h.phone?faD(h.phone):'',h.nid?'کد ملی '+faD(h.nid):'',h.city||'',h.ref?'معرف: '+h.ref:'',h.date?'مراجعه '+h.date:'',h.asst?'پذیرنده: '+h.asst:''].filter(Boolean);
  $('pSum').innerHTML='<div class="pn">'+esc(h.name)+'</div><div class="pl">'+info.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>'+
    (L.length?'<div class="mw">⚠ '+L.map(esc).join(' · ')+'</div>':'<div class="ok">سابقه‌ی پزشکی خاصی ثبت نشده.</div>')+
    '<button type="button" class="btn sm ghost" id="pEdit" style="margin-top:10px">ویرایش مشخصات و سابقه‌ی پزشکی</button>'}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#pEdit');if(!t)return;POPEN=F.id||'new';pSumRender()});
(function(){const ps=$('planSw'),sec=$('sections');if(ps&&sec&&matchMedia('(max-width:900px)').matches){sec.parentNode.insertBefore(ps,sec);ps.classList.add('inl')}})();
document.addEventListener('toggle',e=>{const d=e.target;if(!(d&&d.matches&&d.matches('details.more'))||!d.open)return;const m=d.querySelector('.menu');if(!m)return;m.style.insetInlineEnd='';m.style.insetInlineStart='';const r=m.getBoundingClientRect();if(r.right>innerWidth-8){m.style.insetInlineEnd='auto';m.style.insetInlineStart='0'}else if(r.left<8){m.style.insetInlineStart='auto';m.style.insetInlineEnd='0'}},true);
