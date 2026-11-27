/* ---------- Firestore backend (fast path). Apps Script is kept only for the PDF copy in Drive and manual e-mail ---------- */
const FS_ON=false;
const FB_V='10.12.2',FB_PROJECT='implant-plan-yazd';
let FB=null,FBP=null;
function fbReady(){if(FB)return Promise.resolve(FB);if(FBP)return FBP;
  FBP=(async()=>{const A=await import(`https://www.gstatic.com/firebasejs/${FB_V}/firebase-app.js`);const F=await import(`https://www.gstatic.com/firebasejs/${FB_V}/firebase-firestore.js`);
    const app=A.initializeApp({projectId:FB_PROJECT});let db;
    try{db=F.initializeFirestore(app,{localCache:F.persistentLocalCache({tabManager:F.persistentMultipleTabManager()})})}catch(e){db=F.getFirestore(app)}
    FB={F,db};return FB})().catch(e=>{FBP=null;throw e});
  return FBP}
if(typeof FS_ON!=='undefined'&&FS_ON)fbReady().catch(()=>{}); // start loading the SDK at page load
const FS_ROLE_Q={doctor:['waiting','reviewing'],consultant:['consult','consulting'],staff:['waiting','reviewing','consult','consulting']};
const isoNow=()=>new Date().toISOString();
const tehranDay=d=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit'}).format(d?new Date(d):new Date())}catch(e){return ''}};
async function fsKey(pw){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('fsk|'+pw));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const fsT=()=>{if(!API.t)throw new Error('auth');return API.t};
const pRef=id=>{const {F,db}=FB;return F.doc(db,'c',fsT(),'plans',id)};
const dRef=id=>{const {F,db}=FB;return F.doc(db,'c',fsT(),'pdata',id)};
const pCol=()=>{const {F,db}=FB;return F.collection(db,'c',fsT(),'plans')};
const sRef=()=>{const {F,db}=FB;return F.doc(db,'c',fsT(),'meta','settings')};
const parseD=s=>{try{return typeof s==='string'?JSON.parse(s||'{}'):(s||{})}catch(e){return {}}};
const tcut=(v,n)=>String(v==null?'':v).trim().slice(0,n);
function fsCleanMed(m){m=m||{};const y={},tx={};Object.keys(m.y||{}).slice(0,40).forEach(k=>{if(m.y[k])y[String(k).slice(0,20)]=1});
  Object.keys(m.t||{}).slice(0,10).forEach(k=>{if(y[k])tx[String(k).slice(0,20)]=String(m.t[k]||'').slice(0,300)});return {y,t:tx,other:String(m.other||'').slice(0,1000)}}
function fsCleanPatient(p){p=p||{};return {name:tcut(p.name,200),nid:tcut(p.nid,30),date:tcut(p.date,30),phone:tcut(p.phone,30),age:tcut(p.age,10),asst:tcut(p.asst,100),note:tcut(p.note,2000),med:fsCleanMed(p.med)}}
function fsHeadFields(d){const h=d.h||{};return {phone:h.phone||'',age:h.age||'',date:h.date||'',asst:h.asst||'',note:d.note||'',med:d.med||null}}
function fsCleanPrices(p){const out={},n=v=>String(v==null?'':v).replace(/[^\d]/g,'').slice(0,15);
  Object.keys(p||{}).forEach(k=>{if(!/^[a-z_]{2,10}$/.test(k))return;const v=p[k]||{},bp=v.bp||{};out[k]={price:n(v.price),bp:{ir:n(bp.ir),ko:n(bp.ko),it:n(bp.it),sw:n(bp.sw),rt:n(bp.rt)}}});return out}
function fsItem(m,role,data){const it={id:m.id,name:m.name||'',nid:m.nid||'',phone:m.phone||'',age:m.age||'',date:m.date||'',asst:m.asst||'',note:m.note||'',med:m.med||null,
    status:m.status,queue:m.queue,queuedAt:String(m.queuedAt||''),doneAt:String(m.doneAt||''),consultAt:String(m.consultAt||''),jalali:m.jalali||'',emailStatus:m.emailStatus||'',pdfName:m.fileName||'',edits:Number(m.edits)||0};
  if(role!=='staff'&&m.queue!=='done'&&data)it.data=data;return it}
function fsSortItems(items,role){const key=role==='consultant'?(x=>x.consultAt||x.queuedAt):(x=>x.queuedAt);return items.sort((a,b)=>key(a)<key(b)?-1:1)}
/* data documents of the inbox, cached per version so a change costs one read */
const FS_DCACHE=new Map();
async function fsData(id,ver){const c=FS_DCACHE.get(id);if(c&&c.ver===ver)return c.d;const {F}=FB;const s=await F.getDoc(dRef(id));const d=s.exists()?parseD(s.data().data):{};FS_DCACHE.set(id,{ver,d});return d}

async function fsApi(action,p={}){await fbReady();const {F,db}=FB;
  switch(action){
  case 'ping':{const k=await F.getDoc(F.doc(db,'keys',await fsKey(API.pw)));if(!k.exists())return fsAuthFail();
    const kd=k.data();API.t=kd.t;saveApi();const s=await F.getDoc(sRef());const set=s.exists()?parseD(s.data().json):{};
    return {ok:true,role:kd.role,settings:Object.keys(set).length?set:null,sender:SET.sender||''}}
  case 'queue':{const role=ROLE||LROLE;const want=FS_ROLE_Q[role]||[];const qs=[F.getDocs(F.query(pCol(),F.where('queue','in',want)))];
    if(role==='staff')qs.push(F.getDocs(F.query(pCol(),F.where('doneDay','==',tehranDay()))));
    const snaps=await Promise.all(qs);const metas=[];snaps.forEach(s=>s.forEach(d=>metas.push(d.data())));
    return {ok:true,ver:String(Date.now()),items:await fsBuildItems(metas,role)}}
  case 'list':{const s=await F.getDocs(F.query(pCol(),F.orderBy('updatedAt','desc')));const items=[];s.forEach(d=>{const m=d.data();items.push({id:m.id,name:m.name||'',nid:m.nid||'',status:m.status||'',jalali:m.jalali||'',total:m.total||0,emailStatus:m.emailStatus||'',emailError:m.emailError||'',fileName:m.fileName||'',edits:m.edits||0,createdAt:m.createdAt||'',updatedAt:m.updatedAt||'',queue:m.queue||'',queuedAt:m.queuedAt||'',doneAt:m.doneAt||'',consultAt:m.consultAt||''})});return {ok:true,items}}
  case 'get':{const [ms,ds]=await Promise.all([F.getDoc(pRef(p.id)),F.getDoc(dRef(p.id))]);if(!ms.exists())return fsErr('این فرم پیدا نشد.');const m=ms.data();
    return {ok:true,id:m.id,data:ds.exists()?parseD(ds.data().data):{},status:m.status,jalali:m.jalali||'',emailStatus:m.emailStatus||'',emailError:m.emailError||'',pdfName:m.fileName||'',edits:Number(m.edits)||0}}
  case 'queueAdd':{const pt=fsCleanPatient(p.patient);const id=String(p.id||uuid()).slice(0,60),now=isoNow();
    const d={h:{name:pt.name,nid:pt.nid,date:pt.date,phone:pt.phone,age:pt.age,asst:pt.asst},med:pt.med,note:pt.note,status:'queued',updatedAt:now};
    await F.runTransaction(db,async tx=>{const ex=await tx.get(pRef(id));if(ex.exists())return;
      tx.set(pRef(id),Object.assign({id,name:pt.name,nid:pt.nid,status:'queued',total:0,edits:0,createdAt:now,updatedAt:now,queue:'waiting',queuedAt:now,dUpd:now},fsHeadFields(d)));
      tx.set(dRef(id),{data:JSON.stringify(d)})});return {ok:true,id}}
  case 'queueUpdate':{const pt=fsCleanPatient(p.patient);
    return F.runTransaction(db,async tx=>{const ms=await tx.get(pRef(p.id)),ds=await tx.get(dRef(p.id));if(!ms.exists())return fsErr('این بیمار پیدا نشد.');
      if(ms.data().queue!=='waiting')return fsErr('پزشک پرونده را باز کرده؛ دیگر قابل ویرایش نیست.');const d=ds.exists()?parseD(ds.data().data):{},now=isoNow();
      d.h=Object.assign(d.h||{},{name:pt.name,nid:pt.nid,date:pt.date,phone:pt.phone,age:pt.age,asst:pt.asst});d.note=pt.note;d.med=pt.med;d.updatedAt=now;
      tx.update(pRef(p.id),Object.assign({name:pt.name,nid:pt.nid,updatedAt:now,dUpd:now},fsHeadFields(d)));tx.set(dRef(p.id),{data:JSON.stringify(d)});return {ok:true}})}
  case 'queueDelete':return F.runTransaction(db,async tx=>{const ms=await tx.get(pRef(p.id));if(!ms.exists())return {ok:true};if(ms.data().queue!=='waiting')return fsErr('پزشک پرونده را باز کرده؛ دیگر قابل حذف نیست.');
      tx.delete(pRef(p.id));tx.delete(dRef(p.id));return {ok:true}});
  case 'queueOpen':{const role=ROLE;const from=role==='consultant'?'consult':'waiting',to=role==='consultant'?'consulting':'reviewing';
    return F.runTransaction(db,async tx=>{const ms=await tx.get(pRef(p.id)),ds=await tx.get(dRef(p.id));if(!ms.exists())return fsErr('این بیمار پیدا نشد.');const m=ms.data();
      if(m.queue===from)tx.update(pRef(p.id),{queue:to});return {ok:true,id:m.id,data:ds.exists()?parseD(ds.data().data):{},status:m.status,jalali:m.jalali||'',emailStatus:m.emailStatus||'',pdfName:m.fileName||'',edits:Number(m.edits)||0}})}
  case 'save':return fsSave(p.record,null,p.sendId);
  case 'toConsult':return fsSave(p.record,'consult',p.sendId);
  case 'confirm':return fsConfirm(p);
  case 'settings':{const s=p.settings||{};if(s.recipient&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.recipient))return fsErr('ایمیل گیرنده درست نیست.');
    const clean={recipient:String(s.recipient||'').trim(),clinic:String(s.clinic||'').slice(0,200),doctor:String(s.doctor||'').slice(0,200),phone:String(s.phone||'').slice(0,100),prices:s.prices?fsCleanPrices(s.prices):(SET.prices||{})};
    await F.setDoc(sRef(),{json:JSON.stringify(clean),updatedAt:isoNow()});return {ok:true,settings:clean}}
  default:return fsErr('عملیات ناشناخته')}}
function fsErr(e){return {ok:false,error:e}}
function fsAuthFail(){return {ok:false,error:'auth'}}
async function fsBuildItems(metas,role){const seen=new Set(),uniq=metas.filter(m=>m&&m.id&&!seen.has(m.id)&&seen.add(m.id));
  const items=await Promise.all(uniq.map(async m=>fsItem(m,role,(role!=='staff'&&m.queue!=='done')?await fsData(m.id,m.dUpd||m.updatedAt):null)));return fsSortItems(items,role)}
async function fsSave(rec,toQueue,sendId){if(!rec||!rec.data)return fsErr('اطلاعات فرم نرسید.');const {F,db}=FB;const id=rec.id||uuid();
  return F.runTransaction(db,async tx=>{const ms=await tx.get(pRef(id)),ds=await tx.get(dRef(id)),now=isoNow();let m;
    if(ms.exists()){m=ms.data();if(sendId&&m.lastSend===sendId)return {ok:true,id,status:m.status};m.status=(m.status==='confirmed'||m.status==='modified')?'modified':'draft'}
    else m={id,createdAt:now,status:'draft',edits:0};
    m.name=String(rec.name||'').slice(0,200);m.nid=String(rec.nid||'').slice(0,30);m.updatedAt=now;if(m.queue==='waiting')m.queue='reviewing';
    rec.data.status=m.status;const old=ds.exists()?parseD(ds.data().data):{};
    const fresh=!(old.updatedAt&&rec.data.updatedAt&&String(old.updatedAt)>String(rec.data.updatedAt));
    if(fresh){m.total=Number(rec.total)||0;m.dUpd=rec.data.updatedAt||now;Object.assign(m,fsHeadFields(rec.data))}
    if(toQueue==='consult'){m.queue='consult';m.consultAt=now;if(!m.queuedAt)m.queuedAt=now}
    if(sendId)m.lastSend=sendId;tx.set(pRef(id),m);if(fresh)tx.set(dRef(id),{data:JSON.stringify(rec.data)});return {ok:true,id,status:m.status}})}
async function fsConfirm(req){const rec=req.record;if(!rec||!rec.data)return fsErr('اطلاعات فرم نرسید.');const {F,db}=FB;const id=rec.id||uuid();
  return F.runTransaction(db,async tx=>{const ms=await tx.get(pRef(id)),now=isoNow();let m=ms.exists()?ms.data():{id,createdAt:now,edits:0};
    if(req.sendId&&m.lastSend===req.sendId)return {ok:true,id,emailStatus:m.emailStatus||''};
    const was=m.status==='confirmed'||m.status==='modified';
    Object.assign(m,{name:String(rec.name||'').slice(0,200),nid:String(rec.nid||'').slice(0,30),total:Number(rec.total)||0,status:'confirmed',jalali:String(rec.jalali||''),
      fileName:String(req.fileName||'').replace(/[\/\\:*?"<>|]+/g,' ').slice(0,180),edits:was?(Number(m.edits)||0)+1:(Number(m.edits)||0),updatedAt:now,dUpd:rec.data.updatedAt||now,emailStatus:'',emailError:''},fsHeadFields(rec.data));
    if(['waiting','reviewing','consult','consulting'].includes(m.queue)){m.queue='done';m.doneAt=now;m.doneDay=tehranDay()}
    if(req.sendId)m.lastSend=req.sendId;rec.data.status='confirmed';rec.data.edits=m.edits;
    tx.set(pRef(id),m);tx.set(dRef(id),{data:JSON.stringify(rec.data)});return {ok:true,id,emailStatus:''}})}

/* realtime inbox: Firestore pushes every change; no polling */
let FS_UNSUB=[],FS_SNAP={};
function fsListen(){fsStopListen();if(!ROLE||!API.t)return;fbReady().then(({F})=>{const role=ROLE,want=FS_ROLE_Q[role]||[];FS_SNAP={};
  const on=(key,q)=>FS_UNSUB.push(F.onSnapshot(q,{includeMetadataChanges:true},s=>{const arr=[];s.forEach(d=>arr.push(d.data()));FS_SNAP[key]=arr;setLive(!s.metadata.fromCache);fsRebuild(role)},()=>setLive(false)));
  on('q',F.query(pCol(),F.where('queue','in',want)));
  if(role==='staff')on('d',F.query(pCol(),F.where('doneDay','==',tehranDay())))}).catch(()=>setLive(false))}
function fsStopListen(){FS_UNSUB.forEach(u=>{try{u()}catch(e){}});FS_UNSUB=[]}
let FS_RB=0;
async function fsRebuild(role){const my=++FS_RB;const metas=[].concat(...Object.values(FS_SNAP));
  try{const items=await fsBuildItems(metas,role);if(my!==FS_RB||role!==ROLE)return;applyQueue({ok:true,ver:String(Date.now()),items})}catch(e){}}

function gasCall(body){return new Promise((ok,no)=>google.script.run.withSuccessHandler(r=>{try{ok(JSON.parse(r))}catch(e){no(new Error('پاسخ سرور قابل خواندن نبود.'))}}).withFailureHandler(e=>no(new Error('اتصال به سرور برقرار نشد: '+(e&&e.message||e)))).api(body))}
/* One request at a time. Two requests in flight at once stall each other for 10–30 s on the clinic's
   connection, so every call goes through this queue: user actions first, background sends next, polls last.
   A user action aborts a running poll; a stalled request is cut off and retried instead of waiting. */
const RQ={list:[],cur:null};
const RQ_OPT=CF_ON?{user:{timeout:6000,tries:3},bg:{timeout:12000,tries:2},poll:{timeout:4000,tries:1}}:{user:{timeout:7000,tries:3},bg:{timeout:12000,tries:2},poll:{timeout:6000,tries:1}};
function rqPump(){if(RQ.cur||!RQ.list.length)return;RQ.list.sort((a,b)=>a.rank-b.rank);const job=RQ.list.shift();RQ.cur=job;
  rqRun(job).then(job.ok,job.no).finally(()=>{RQ.cur=null;rqPump()})}
async function rqRun(job){const o=Object.assign({},RQ_OPT[job.prio],job.opt||{});let last;
  for(let i=0;i<o.tries;i++){if(job.aborted)throw new Error('aborted');const ctrl=new AbortController();job.ctrl=ctrl;const tm=setTimeout(()=>ctrl.abort(),o.timeout);
    try{const res=await fetch(API.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:job.body,signal:ctrl.signal});return await res.json()}
    catch(e){last=e;if(job.aborted)throw new Error('aborted')}
    finally{clearTimeout(tm)}}
  throw last||new Error('fail')}
function rqCall(body,prio,opt){return new Promise((ok,no)=>{const job={body,prio,opt,rank:prio==='user'?0:prio==='bg'?1:2,ok,no,aborted:false};
  if(prio==='user'&&RQ.cur&&RQ.cur.prio==='poll'){RQ.cur.aborted=true;RQ.cur.ctrl&&RQ.cur.ctrl.abort()}
  RQ.list.push(job);rqPump()})}
async function gasApi(action,payload={},opt={}){const prio=opt.prio||'user';
  if(IN_GAS){const j=await gasCall(JSON.stringify({action,password:API.pw,...payload}));
    if(!j.ok){if(j.error==='auth'){logout();throw new Error('رمز عبور اشتباه است.')}throw new Error(j.error||'خطای سرور')}return j}
  if(!API.url)throw new Error('آدرس سرور تنظیم نشده است.');
  let j;
  try{const ro={};if(opt.timeout)ro.timeout=opt.timeout;if(opt.tries)ro.tries=opt.tries;j=await rqCall(JSON.stringify({action,password:API.pw,...payload}),prio,ro)}
  catch(e){if(e&&e.message==='aborted')throw new Error('aborted');throw new Error('اتصال به سرور برقرار نشد. اینترنت یا فیلترشکن را چک کنید.')}
  if(!j||typeof j!=='object')throw new Error('پاسخ سرور قابل خواندن نبود. آدرس سرور را چک کنید.');
  if(!j.ok){if(j.error==='auth'){try{const c=AUTHC();delete c[ROLE||LROLE];localStorage.setItem('implantAuth',JSON.stringify(c))}catch(e){}logout();throw new Error('رمز عبور اشتباه است.')}throw new Error(j.error||'خطای سرور')}
  return j}

