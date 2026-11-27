
/* ---------- lf3: (1) tooth buttons ignore the phone's double-tap zoom, so two quick taps = pontic; (2) a page left open after a release shows
   «نسخه‌ی تازه‌ی سایت آمده — تازه کنید» (the page's ETag is checked every minute and when the tab comes back) ---------- */
const LF3={tag:null,shown:false,busy:false};
async function lf3Check(){if(LF3.shown||LF3.busy||!navigator.onLine)return;LF3.busy=true;
  try{const r=await fetch(location.pathname||'/',{method:'HEAD',cache:'no-store'});const t=r.ok?(r.headers.get('etag')||''):'';if(t){if(LF3.tag===null)LF3.tag=t;else if(t!==LF3.tag)lf3Show()}}catch(e){}finally{LF3.busy=false}}
function lf3Show(){if(LF3.shown)return;LF3.shown=true;const d=document.createElement('div');d.id='lf3Bar';d.className='lf3bar';d.setAttribute('role','status');
  d.innerHTML='<span>نسخه‌ی تازه‌ی سایت آمده است. برای استفاده از تغییرها صفحه را تازه کنید (کار ذخیره‌نشده را اول ذخیره کنید).</span><button type="button" class="btn sm" id="lf3Go">تازه کردن</button><button type="button" class="btn sm ghost" id="lf3No" aria-label="بستن">بعداً</button>';
  document.body.appendChild(d);$('lf3Go').onclick=()=>location.reload();$('lf3No').onclick=()=>{d.remove()}}
lf3Check();setInterval(()=>{if(!document.hidden)lf3Check()},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)lf3Check()});
