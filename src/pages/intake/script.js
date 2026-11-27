
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toEn=s=>String(s??'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const MED_Q=[['cur','آیا در حال حاضر مبتلا به بیماری خاصی هستید؟'],['drug','آیا تحت درمان دارویی بوده یا هستید؟'],['dent','آیا در درمان‌های دندانپزشکی دچار مشکل شده‌اید؟'],['alg','آیا به دارو یا غذایی حساسیت داشته‌اید؟'],['hosp','آیا سابقه‌ی بستری در بیمارستان دارید؟']];
const YR=['کمتر از یک سال','بیشتر از یک سال'];
const MED_D=[['diab','دیابت',['قند ناشتا بالای ۱۸۰','قند ناشتا زیر ۱۸۰']],['bp','فشار خون'],['angio','سابقه جراحی آنژیوگرافی',YR],['ohs','عمل قلب باز',YR],['chemo','سابقه شیمی‌درمانی یا پرتودرمانی'],['cort','مصرف داروهای کورتون'],['resp','بیماری تنفسی'],['seiz','سابقه تشنج']];
const DEFAULT_CONSENT=`اینجانب {name} با آگاهی کامل و با رضایت شخصی، انجام طرح درمان ایمپلنت و درمان‌های همراه آن را که توسط پزشک معالج در {clinic} برایم توضیح داده شده است، می‌پذیرم.
۱. روش درمان، مراحل، مدت تقریبی درمان و گزینه‌های درمانی جایگزین برای من توضیح داده شد و فرصت پرسیدن سؤال داشتم.
۲. می‌دانم که مانند هر جراحی دیگری، عوارضی مانند درد، تورم، کبودی، خونریزی، عفونت، بی‌حسی موقت یا در موارد نادر طولانی لب و چانه، درگیری سینوس و عدم جوش خوردن یا از دست رفتن ایمپلنت ممکن است رخ دهد و در این صورت درمان تکمیلی لازم می‌شود.
۳. سابقه‌ی پزشکی، داروهای مصرفی و حساسیت‌های خود را به‌طور کامل و صحیح اعلام کرده‌ام و مسئولیت اعلام نکردن آن‌ها با خودم است.
۴. متعهد می‌شوم دستورات بهداشتی و دارویی پزشک را رعایت کنم، در نوبت‌های کنترل حاضر شوم و از استعمال دخانیات در دوره‌ی درمان پرهیز کنم.
۵. هزینه‌ها و شرایط پرداخت که در این طرح درمان نوشته شده است را مطالعه کرده و می‌پذیرم. قیمت‌ها تقریبی است و تغییر طرح درمان می‌تواند هزینه را تغییر دهد.`;
const tok=(location.hash||'').slice(1).replace(/[^0-9a-f]/g,'');
const api=b=>fetch(location.origin+'/',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(Object.assign({tok},b))}).then(r=>r.json());
let J=null,M={y:{},t:{},other:''},signed=false;
function medHTML(){const yn=k=>`<span class="yn" role="group"><button type="button" data-k="${k}" data-v="0" aria-pressed="${!M.y[k]}">خیر</button><button type="button" data-k="${k}" data-v="1" aria-pressed="${!!M.y[k]}">بله</button></span>`;
  return MED_Q.map(([k,l])=>`<div class="mrow"><span>${l}</span>${yn(k)}${M.y[k]?`<input data-t="${k}" value="${esc(M.t[k]||'')}" placeholder="${k==='hosp'?'به چه علت؟':k==='drug'||k==='cur'?'نام بیماری یا دارو':'توضیح دهید'}">`:''}</div>`).join('')+
  `<h2 style="margin-top:14px">آیا به هیچ‌کدام از بیماری‌های زیر مبتلا بوده یا هستید؟</h2>`+MED_D.map(([k,l,o])=>`<div class="mrow"><span>${l}</span>${yn(k)}${o&&M.y[k]?`<span class="msub">${o.map(v=>`<button type="button" class="chip" data-s="${k}" data-sv="${esc(v)}" aria-pressed="${M.t[k]===v}">${v}</button>`).join('')}</span>`:''}${k==='diab'&&M.y[k]?`<span class="msub"><span class="muted">قند سه ماهه (HbA1c)، اگر می‌دانید:</span>${['زیر ۷٫۵','بالای ۷٫۵'].map(v=>`<button type="button" class="chip" data-s="hba" data-sv="${v}" aria-pressed="${M.t.hba===v}">${v}</button>`).join('')}</span>`:''}</div>`).join('')}
function renderMed(){$('med').innerHTML=medHTML()}
function consentTxt(){const n=($('f_name')&&$('f_name').value.trim())||'……………';return (J.consent||DEFAULT_CONSENT).replace(/\{name\}/g,n).replace(/\{clinic\}/g,J.clinic||'کلینیک')}
function view(){const p=J.p||{},el=$('app');M={y:{...((p.med||{}).y||{})},t:{...((p.med||{}).t||{})},other:(p.med||{}).other||''};
  el.innerHTML=`<header><img src="icon-192.png" alt=""><div><h1>${esc(J.clinic||'کلینیک')}</h1><p>فرم پذیرش پیش از مراجعه</p></div></header>
  ${J.filled?'<section class="card"><p class="msg ok" style="margin:0">این فرم قبلاً فرستاده شده است. اگر چیزی را اشتباه نوشته‌اید، اصلاح کنید و دوباره بفرستید.</p></section>':''}
  <section class="card"><h2>مشخصات</h2><p class="muted" style="margin:0">با پر کردن این فرم، روز مراجعه زمان کمتری در پذیرش می‌مانید.</p>
   <label class="f">نام و نام خانوادگی *<input id="f_name" autocomplete="name" value="${esc(p.name||J.name||'')}"></label>
   <div class="two"><label class="f">شماره‌ی موبایل *<input id="f_phone" inputmode="tel" autocomplete="tel" dir="ltr" value="${esc(p.phone||J.phone||'')}"></label>
   <label class="f">کد ملی<input id="f_nid" inputmode="numeric" dir="ltr" value="${esc(p.nid||'')}"></label>
   <label class="f">سن<input id="f_age" inputmode="numeric" value="${esc(p.age||'')}"></label>
   <label class="f">شهر<input id="f_city" value="${esc(p.city||'')}"></label></div>
   <label class="f">معرف <small>(چطور با ما آشنا شدید؟ اگر کسی شما را معرفی کرده، نامش را بنویسید)</small><input id="f_ref" list="refs" value="${esc(p.ref||'')}"></label>
   <datalist id="refs"><option value="دوستان و آشنایان"><option value="اینستاگرام"><option value="جستجو در اینترنت"><option value="پزشک یا دندانپزشک دیگر"><option value="بیمار قبلی کلینیک"><option value="تابلو و رهگذر"></datalist></section>
  <section class="card"><h2>سابقه‌ی پزشکی</h2><div id="med"></div>
   <label class="f">توضیحات دیگر <small>(بیماری، دارو یا نکته‌ای که در فهرست نیست)</small><textarea id="f_other" rows="2">${esc(M.other)}</textarea></label></section>
  <section class="card"><h2>رضایت‌نامه‌ی عمومی</h2><div class="consent" id="ctx"></div>
   <label class="agree"><input type="checkbox" id="f_ok"> متن بالا را خواندم و می‌پذیرم.</label>
   <p class="muted" style="margin:10px 0 0">با انگشت در کادر زیر امضا کنید:</p><canvas id="pad" width="900" height="340" aria-label="کادر امضا"></canvas><button type="button" class="btn ghost" id="clr">پاک کردن امضا</button></section>
  <button class="btn" id="send">ارسال فرم</button><div class="msg" id="msg" role="status"></div>
  <p class="muted" style="text-align:center;margin-top:16px">این اطلاعات فقط در پرونده‌ی شما در کلینیک ثبت می‌شود.</p>`;
  renderMed();$('ctx').textContent=consentTxt();$('f_name').addEventListener('input',()=>{$('ctx').textContent=consentTxt()});
  $('med').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.k){const k=b.dataset.k;if(b.dataset.v==='1')M.y[k]=1;else{delete M.y[k];delete M.t[k];if(k==='diab'){delete M.y.hba;delete M.t.hba}}renderMed();const i=document.querySelector(`[data-t="${k}"]`);if(i)i.focus();return}
    if(b.dataset.s){const k=b.dataset.s,v=b.dataset.sv;if(M.t[k]===v){delete M.t[k];if(k==='hba')delete M.y.hba}else{M.t[k]=v;if(k==='hba')M.y.hba=1}renderMed()}});
  $('med').addEventListener('input',e=>{const k=e.target.dataset.t;if(k)M.t[k]=e.target.value});
  pad();$('send').onclick=send}
function pad(){const c=$('pad'),cx=c.getContext('2d');let on=false,last=null;cx.lineWidth=5;cx.lineCap='round';cx.lineJoin='round';cx.strokeStyle='#111';
  const pt=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
  c.addEventListener('pointerdown',e=>{on=true;last=pt(e);c.setPointerCapture(e.pointerId);e.preventDefault()});
  c.addEventListener('pointermove',e=>{if(!on)return;const p=pt(e);cx.beginPath();cx.moveTo(last[0],last[1]);cx.lineTo(p[0],p[1]);cx.stroke();last=p;signed=true});
  const up=()=>{on=false};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  $('clr').onclick=()=>{cx.clearRect(0,0,c.width,c.height);signed=false}}
function sig(){const c=$('pad'),w=450,h=170,o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(c,0,0,w,h);return o.toDataURL('image/png')}
async function send(){const m=$('msg'),v=id=>$(id).value.trim();m.className='msg';
  const err=t=>{m.className='msg err';m.textContent=t};
  if(!v('f_name'))return err('نام و نام خانوادگی را بنویسید.');
  if(!/^0?9\d{9}$/.test(toEn(v('f_phone')).replace(/[^\d]/g,'').replace(/^98/,'0')))return err('شماره‌ی موبایل را درست بنویسید (مثل ۰۹۱۲۰۰۰۰۰۰۲).');
  const miss=MED_Q.concat(MED_D).find(([k])=>M.y[k]&&MED_Q.some(q=>q[0]===k)&&!(M.t[k]||'').trim());if(miss)return err('برای «'+miss[1]+'» توضیح کوتاهی بنویسید.');
  if(!$('f_ok').checked)return err('برای ارسال، تیک پذیرش رضایت‌نامه را بزنید.');
  if(!signed)return err('لطفاً در کادر، امضا کنید.');
  M.other=v('f_other');const b=$('send');b.disabled=true;m.textContent='در حال ارسال…';
  try{const r=await api({action:'intakeSubmit',p:{name:v('f_name'),phone:toEn(v('f_phone')),nid:toEn(v('f_nid')),age:toEn(v('f_age')),city:v('f_city'),ref:v('f_ref'),med:M},sign:sig(),consent:consentTxt()});
    if(!r.ok){b.disabled=false;return err(r.error||'ارسال نشد؛ دوباره امتحان کنید.')}
    $('app').innerHTML=`<header><img src="icon-192.png" alt=""><div><h1>${esc(J.clinic||'کلینیک')}</h1><p>فرم پذیرش پیش از مراجعه</p></div></header><section class="card done"><b>فرم شما ثبت شد ✓</b>سپاس. روز مراجعه، فقط نام خود را به پذیرش بگویید.</section>`;window.scrollTo(0,0)}
  catch(e){b.disabled=false;err('اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره بزنید.')}}
async function go(){const el=$('app');if(!/^[0-9a-f]{36}$/.test(tok)){el.innerHTML='<div class="empty">این لینک کامل نیست؛ لطفاً لینک را دوباره از کلینیک بگیرید.</div>';return}
  try{J=await api({action:'intakeGet'})}catch(e){el.innerHTML='<div class="empty">اتصال برقرار نشد. اینترنت را بررسی کنید و صفحه را دوباره باز کنید.</div>';return}
  if(!J.ok){el.innerHTML=`<div class="empty">${esc(J.error||'این لینک معتبر نیست.')}</div>`;return}if(J.filled){el.innerHTML=`<header><img src="icon-192.png" alt=""><div><h1>${esc(J.clinic||'کلینیک')}</h1><p>فرم پذیرش پیش از مراجعه</p></div></header><section class="card done"><b>این فرم قبلاً فرستاده شده است ✓</b>اگر چیزی را باید اصلاح کنید، روز مراجعه به پذیرش بگویید.</section>`;return}view()}
go();
