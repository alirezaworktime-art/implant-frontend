/* ---------- confirm flow ---------- */
let lastPDF=null,busy=false;const PK={btn:null};
const $=id=>document.getElementById(id);
const validEmail=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s||'');
function step(n,st){$('st'+n).className='s '+(st||'')}
function safeName(s){return String(s||'').replace(/[\/\\:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim()}
function alertMsg(t){const b=$('editNote');b.hidden=false;b.textContent=t;b.scrollIntoView({behavior:'smooth',block:'center'})}
async function openConfirm(){$('cClose').textContent='بستن';BACK_TO_Q=false;
  const msg=$('cMsg');msg.className='msg';msg.textContent='';$('cSteps').hidden=true;$('cPrev').innerHTML='';['st1','st2','st3'].forEach(id=>$(id).className='s');
  
  const j=jalali(new Date());const fname=`${safeName(F.h.name||'بیمار')} - ${j.dash}.pdf`;
  $('cFile').textContent=fname;$('cTo').textContent=SET.recipient||'تعیین نشده';
  $('cTitle').textContent=(F.status==='confirmed'||F.status==='modified')?'ثبت ویرایش و ارسال مجدد':'ثبت نهایی و ارسال';
  $('cSheet').hidden=false;$('cGo').disabled=true;$('cDl').disabled=true;$('cPrint').disabled=true;msg.textContent='در حال ساخت پیش‌نمایش PDF…';
  try{lastPDF=await buildPDF(F,{jalali:j.slash});lastPDF.name=fname;lastPDF.jalali=j;
    $('cPrev').innerHTML=lastPDF.previews.map((u,i)=>`<img src="${u}" alt="صفحه ${fa(i+1)} PDF">`).join('');
    msg.textContent='پیش‌نمایش را چک کنید، بعد «تأیید و ارسال» را بزنید.';$('cDl').disabled=false;$('cPrint').disabled=false;
    if(!validEmail(SET.recipient)){msg.className='msg err';msg.textContent='ایمیل گیرنده تعیین نشده. از «تنظیمات» واردش کنید.'}else $('cGo').disabled=false}
  catch(e){msg.className='msg err';msg.textContent='ساخت PDF ناموفق بود: '+(e&&e.message||e)}}
