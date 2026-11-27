
const T=[
['GitHub Pages (سایت فعلی)','https://alirezaworktime-art.github.io/implant-plan/probe.html'],
['Google Apps Script (سرور فعلی)','https://script.google.com/macros/s/APPS_SCRIPT_DEPLOYMENT_ID/exec'],
['Firebase Firestore','https://firestore.googleapis.com/'],
['Firebase Realtime DB','https://firebaseio.com/'],
['Firebase Hosting','https://firebase.web.app/'],
['Google Cloud Run','https://run.app/'],
['Google Sheets API','https://sheets.googleapis.com/'],
['Cloudflare','https://www.cloudflare.com/cdn-cgi/trace'],
['Cloudflare Workers','https://workers.dev/'],
['Cloudflare Pages','https://pages.dev/'],
['Deno Deploy','https://deno.dev/'],
['Vercel','https://vercel.app/'],
['Netlify','https://netlify.app/'],
['Render','https://onrender.com/'],
['Koyeb','https://koyeb.app/'],
['Railway','https://up.railway.app/'],
['Fly.io','https://fly.dev/'],
['Glitch','https://glitch.me/'],
['Supabase','https://supabase.co/'],
['Upstash','https://upstash.io/'],
['Neon','https://neon.tech/'],
['Appwrite','https://cloud.appwrite.io/v1/health/version'],
['PocketHost','https://pockethost.io/'],
['Back4App','https://parseapi.back4app.com/'],
['JSONBin','https://api.jsonbin.io/'],
['GitHub API','https://api.github.com/'],
['jsDelivr','https://cdn.jsdelivr.net/'],
['Azure','https://azurewebsites.net/'],
['AWS Lambda','https://lambda-url.us-east-1.on.aws/'],
['لیارا (ایرانی)','https://liara.ir/'],
['ابر آروان (ایرانی)','https://www.arvancloud.ir/'],
['همروش / داکوب (ایرانی)','https://hamravesh.com/'],
];
const tb=document.getElementById('tb'),st=document.getElementById('st');
function row(n,u){const tr=document.createElement('tr');tr.innerHTML=`<td>${n}</td><td>…</td><td></td><td class="u">${u}</td>`;tb.appendChild(tr);return tr}
// functional checks: real HTTP status (detects sanction 403 blocks that no-cors cannot see)
const FN=[
['Firestore (خواندن واقعی)','https://firestore.googleapis.com/v1/projects/implant-plan-yazd/databases/(default)/documents/keys/probe',s=>s===404||s===200],
['Apps Script (درخواست واقعی)','https://script.google.com/macros/s/APPS_SCRIPT_DEPLOYMENT_ID/exec',s=>s===200,'POST'],
['Cloudflare DNS API','https://cloudflare-dns.com/dns-query?name=example.com&type=A',s=>s===200,'GET',{accept:'application/dns-json'}],
['GitHub API (واقعی)','https://api.github.com/zen',s=>s===200],
['JSONBin (واقعی)','https://api.jsonbin.io/v3/b/000000000000000000000000',s=>s>0&&s!==403&&s!==451],
];
async function fhit(u,okf,method,headers){const c=new AbortController(),to=setTimeout(()=>c.abort(),10000),t=performance.now();
  try{const o={method:method||'GET',cache:'no-store',signal:c.signal,headers:headers||{}};if(o.method==='POST')o.body=JSON.stringify({action:'ping',pw:''});
    const r=await fetch(u,o);const ms=Math.round(performance.now()-t);return okf(r.status)?ms:-r.status}catch(e){return null}finally{clearTimeout(to)}}
async function hit(u){const c=new AbortController(),to=setTimeout(()=>c.abort(),8000),t=performance.now();
  try{await fetch(u+(u.includes('?')?'&':'?')+'_='+Date.now(),{mode:'no-cors',cache:'no-store',signal:c.signal});return Math.round(performance.now()-t)}catch(e){return null}finally{clearTimeout(to)}}
function show(tr,r){const ok=r.filter(x=>x!=null);const best=ok.length?Math.min(...ok):null;
  tr.cells[1].innerHTML=!ok.length?'<span class="bad">باز نشد</span>':ok.length<r.length?'<span class="slow">ناپایدار</span>':best>1500?'<span class="slow">کند</span>':'<span class="ok">باز شد</span>';
  tr.cells[2].textContent=r.map(x=>x==null?'×':x).join(' / ')}
function fshow(tr,r){const ok=r.filter(x=>x!=null&&x>=0);const blk=r.find(x=>x!=null&&x<0);
  tr.cells[1].innerHTML=ok.length===r.length?'<span class="ok">کار کرد</span>':blk!=null?`<span class="bad">مسدود (${-blk})</span>`:ok.length?'<span class="slow">ناپایدار</span>':'<span class="bad">باز نشد</span>';
  tr.cells[2].textContent=r.map(x=>x==null?'×':x<0?'⛔':x).join(' / ')}
function load(){try{const s=JSON.parse(localStorage.getItem('probeResults')||'null');if(!s)return;st.textContent='آخرین تست: '+new Date(s.at).toLocaleString('fa-IR');
  FN.forEach(([n,u])=>{const tr=row(n,u);if(s.r[n])fshow(tr,s.r[n])});
  T.forEach(([n,u])=>{const tr=row(n,u);if(s.r[n])show(tr,s.r[n])})}catch(e){}}
document.getElementById('go').onclick=async()=>{tb.innerHTML='';st.textContent='در حال تست…';const res={};
  const rows=T.map(([n,u])=>row(n,u));
  const frows=FN.map(([n,u])=>row(n,u));
  for(let k=0;k<3;k++){for(let i=0;i<FN.length;i++){const [n,u,okf,m,h]=FN[i];const v=await fhit(u,okf,m,h);(res[n]=res[n]||[]).push(v);fshow(frows[i],res[n])}}
  for(let k=0;k<3;k++){await Promise.all(T.map(async([n,u],i)=>{(res[n]=res[n]||[]).push(await hit(u));show(rows[i],res[n])}))}
  try{localStorage.setItem('probeResults',JSON.stringify({at:Date.now(),vpn:'off?',r:res}))}catch(e){}
  st.textContent='تمام شد ✓ (ذخیره شد)'};
load();
