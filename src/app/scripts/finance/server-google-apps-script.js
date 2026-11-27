/* ---------- server (Google Apps Script) ---------- */
const API_URL_DEFAULT='https://script.google.com/macros/s/APPS_SCRIPT_DEPLOYMENT_ID/exec'; // after deploying Apps Script, paste its /exec URL here
let API={url:'',pw:''};
try{const a=JSON.parse(localStorage.getItem('implantApi')||'null');if(a)API=a}catch(e){}
const CF_URL=(location.protocol.startsWith('http')?location.origin:'https://implant-api.implant-yazd.workers.dev')+'/'; //; // Cloudflare Worker (fast backend); empty = Apps Script only
const CF_ON=!!CF_URL,GAS_URL=API_URL_DEFAULT;
if(API_URL_DEFAULT)API.url=API_URL_DEFAULT;
if(CF_ON)API.url=CF_URL;
const saveApi=()=>{try{localStorage.setItem('implantApi',JSON.stringify(API))}catch(e){}};
const IN_GAS=typeof google!=='undefined'&&google.script&&google.script.run;
function fsErrMsg(e){const c=e&&e.code||'';if(c==='permission-denied')return 'auth';if(c==='unavailable'||c==='deadline-exceeded'||/network|fetch|offline/i.test(String(e&&e.message)))return 'اتصال به سرور برقرار نشد. اینترنت را چک کنید.';return String(e&&e.message||e)}
async function api(action,payload={},opt={}){
  if(FS_ON&&action!=='resend'&&action!=='gasConfirm'&&action!=='gasSettings'){let j;
    try{j=await fsApi(action,payload)}catch(e){const m=fsErrMsg(e);j=m==='auth'?{ok:false,error:'auth'}:null;if(!j)throw new Error(m)}
    if(!j.ok){if(j.error==='auth'){try{const c=AUTHC();delete c[ROLE||LROLE];localStorage.setItem('implantAuth',JSON.stringify(c))}catch(e){}logout();throw new Error('رمز عبور اشتباه است.')}throw new Error(j.error||'خطا')}
    return j}
  if(CF_ON&&(action==='resend'||action==='gasConfirm'||action==='gasSettings'))return gasDirect(action==='gasConfirm'?'confirm':action==='gasSettings'?'settings':action,payload,opt);
  return gasApi(action==='gasConfirm'?'confirm':action==='gasSettings'?'settings':action,payload,opt)}
/* Apps Script direct call (CF mode: PDF copy in Drive, manual e-mail, settings backup) — outside the fast request queue */
async function gasDirect(action,payload={},opt={}){if(!GAS_URL)throw new Error('آدرس سرور گوگل تنظیم نشده است.');const tries=opt.tries||1;let last;
  for(let i=0;i<tries;i++){const ctrl=new AbortController(),tm=setTimeout(()=>ctrl.abort(),opt.timeout||60000);
    try{const r=await fetch(GAS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,password:API.pw,...payload}),signal:ctrl.signal});const j=await r.json();
      if(!j.ok)throw new Error(j.error==='auth'?'رمز سرور گوگل با این رمز یکی نیست.':(j.error||'خطای سرور گوگل'));return j}
    catch(e){last=e}finally{clearTimeout(tm)}}
  throw new Error(last&&last.name==='AbortError'?'اتصال به سرور گوگل برقرار نشد.':(last&&last.message||'اتصال به سرور گوگل برقرار نشد.'))}
