/* ---------- lab4 (owner, 2026-10-28): lab cartable = 4 stage tabs (the prosthesis doctor picks the stage), «آماده و ارسال»,
   floating «+ کار جدید» (Hani sheet + stage, site patient or another clinic) and «جست‌وجو»; internal steps hidden ---------- */
Object.keys(LFOR).forEach(k=>{if(!['tryin','rabt','deliv'].includes(k))delete LFOR[k]});LFOR.tryin='رزین پیچ‌شونده';LFOR.rabt='رزین اباتمنت';LFOR.deliv='کار نهایی';LFOR.abut='اباتمنت';
const L4T=[['tryin','رزین پیچ‌شونده'],['rabt','رزین اباتمنت'],['deliv','کار نهایی'],['abut','اباتمنت']];
const l4F=x=>{const f=(x.data||{}).for;return f==='rabt'||f==='deliv'||f==='abut'?f:'tryin'};
const l4Act=x=>['new','recv','making','redo'].includes(x.st);
const l4Lbl=k=>(L4T.find(t=>t[0]===k)||[,''])[1];
const l4Num=v=>String(v||'').replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
var L4N=null;
TILES.lab=()=>L4T.map(([k,l],i)=>({k:'s_'+k,c:['lab','surg','cons','pros'][i],l,s:'کارهای این مرحله',n:LB.items.filter(x=>l4Act(x)&&l4F(x)===k).length,seg:'s_'+k}));
TCOUNT.lab=L4T.map(t=>'s_'+t[0]);
function l4Pill(x){if(x.st==='redo')return '<span class="pill late">برگشت برای اصلاح</span>';if(x.st==='new')return '<span class="pill">کار تازه</span>';if(l4Act(x))return '<span class="pill">در حال ساخت</span>';return `<span class="pill ${LSTC[x.st]||''}">${esc(LST[x.st]||x.st)}</span>`}
function l4Card(x){const d=x.data||{};let h=l2Card(x);
  h=h.replace('<div class="meta">دندان‌ها:',`<div class="meta l4st">مرحله: <b>${esc(l4Lbl(l4F(x)))}</b>${d.clinic?' · کلینیک <b>'+esc(d.clinic)+'</b>':''}</div><div class="meta">دندان‌ها:`);
  return h.replace('class="item labcard l2c','class="item labcard l4c l2c')}
function l4Fab(){let f=$('l4Fab');if(!f){f=document.createElement('div');f.id='l4Fab';f.innerHTML='<button type="button" class="btn main" data-l4new>＋ کار جدید</button><button type="button" class="btn" data-l4find>جست‌وجو</button>';document.body.appendChild(f)}
  f.hidden=ROLE!=='lab'||$('viewLab').hidden}
renderLab=function(){if(ROLE!=='lab')return;if(!/^s_/.test(LB.seg)||!l4Lbl(LB.seg.slice(2)))LB.seg='s_tryin';const k=LB.seg.slice(2);
  const nw=LB.items.filter(x=>x.st==='new'||x.st==='redo').length,b=$('labBadge');if(b){b.hidden=!nw;b.textContent=fa(nw)}document.title=(nw?`(${fa(nw)}) `:'')+'سفارش‌های لابراتوار';
  try{renderTiles()}catch(e){}l4Fab();
  const rows=LB.items.filter(x=>l4Act(x)&&l4F(x)===k).sort((a,b)=>((b.st==='redo')-(a.st==='redo'))||(((b.data||{}).prio==='urgent')-((a.data||{}).prio==='urgent'))||String(a.due).localeCompare(String(b.due)));
  $('lbList').innerHTML=`<h3 class="pf-h l4h">${esc(l4Lbl(k))} <small class="meta">${rows.length?fa(rows.length)+' کار':''}</small></h3>`+(rows.length?rows.map(l4Card).join(''):'<div class="empty">کاری در این مرحله نیست.</div>')};
/* order sheet: Hani steps stay; show the stage and clinic */
(function(){const _r=l2Render;l2Render=function(){const r=_r.apply(this,arguments);try{const box=$('l2In'),o=L2.ord.order,d=o.data||{};const p=box&&box.querySelector('.l2info');
  if(p&&!box.querySelector('.l4st'))p.insertAdjacentHTML('beforebegin',`<div class="meta l4st">مرحله: <b>${esc(l4Lbl(l4F(o)))}</b>${d.clinic?' · کلینیک <b>'+esc(d.clinic)+'</b>':''}</div>`)}catch(e){}return r}})();
/* «دریافت و شروع کار» in the «رزین پیچ‌شونده» tab: the short resin process is preselected */
const L4RS=990001;
(function(){const _o=l2StartOpen;l2StartOpen=async function(lid){const x=LB.items.find(i=>i.id===lid)||(L2.ord&&L2.ord.order&&L2.ord.order.id===lid?L2.ord.order:null);
  const r=await _o.apply(this,arguments);
  try{const w=$('l2wt'),sh=$('l2StSh');if(x&&l4F(x)==='tryin'&&w&&!(x.data||{}).wtid&&sh&&!sh.hidden&&w.querySelector(`option[value="${L4RS}"]`)){w.value=String(L4RS);if(w.onchange)w.onchange()}}catch(e){}return r}})();
async function l4Ready(lid,t){if(!t.dataset.armed){t.dataset.armed='1';const o=t.textContent;t.textContent='دوباره بزنید تا ارسال شود';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.textContent=o}},4000);return}
  t.disabled=true;try{await api('labSet',{lid,st:'ready',by:USERNAME||'لابراتوار'});toast('کار آماده شد و به کلینیک ارسال شد.');const s=$('l2Sheet');if(s&&!s.hidden&&L2.ord&&L2.ord.id===lid){s.hidden=true;L2.ord=null}const q=$('l4sSheet');if(q&&!q.hidden)l4Find(true);pollLab(true)}
  catch(e){alertMsg(e.message);t.disabled=false}}
/* search */
let L4Q={q:'',t:null,n:0};
function l4Search(){const s=mkSheet('l4sSheet',`<h3>جست‌وجوی کار</h3><label class="f">نام بیمار یا شماره کار<input id="l4q" autocomplete="off" placeholder="مثلاً رضایی یا ۱۰۰۲" value="${esc(L4Q.q)}"></label><div class="list" id="l4sRes"></div><div class="btns"><button class="btn ghost" type="button" id="l4sX">بستن</button></div>`);
  s.hidden=false;$('l4sX').onclick=()=>{s.hidden=true};const i=$('l4q');i.oninput=()=>{L4Q.q=i.value;clearTimeout(L4Q.t);L4Q.t=setTimeout(()=>l4Find(),300)};setTimeout(()=>i.focus(),50);l4Find()}
async function l4Find(){const box=$('l4sRes');if(!box)return;const q=l4Num(L4Q.q).trim(),n=++L4Q.n;if(!q){box.innerHTML='<div class="empty">نام بیمار یا شماره‌ی کار را بنویسید.</div>';return}
  try{const j=await api('lab4Find',{q});if(n!==L4Q.n)return;box.innerHTML=(j.items||[]).length?j.items.map(l4Card).join('').replace(/data-l2open=/g,'data-l4open='):'<div class="empty">کاری پیدا نشد.</div>'}catch(e){box.innerHTML=`<div class="empty">${esc(e.message)}</div>`}}
/* new work */
function l4New(){LOF=[];L4N={pid:'',mode:'site',pq:'',res:[],clinic:'',n:0,t:null};
  LO={teeth:[],all:[],pon:[],type:'',mat:'',abut:'',ret:'',shade:'',meth:'',sys:'',doc:'',note:'',due:dAdd(tDay(),10),for:'',F:L4T.map(t=>t[0])};
  LO.h9={doc:'',brand:'',asst:'',name:'',file:'',day:jDay(tDay()),shade:'',age:'',photo:'',crown:[],imp:[],itype:[],imat:[],base:[],pon:[],draw:'',drawN:0};
  const s=mkSheet('l4nSheet','<h3>ایجاد کار جدید</h3><div id="l4nBody"></div><div class="msg" id="l4nMsg"></div><div class="btns"><button class="btn" type="button" id="l4nSave">ثبت کار</button><button class="btn ghost" type="button" id="l4nX">انصراف</button></div>');
  s.classList.add('l4nsheet');s.hidden=false;$('l4nX').onclick=()=>{s.hidden=true;L4N=null;LO=null;LOF=[]};$('l4nSave').onclick=e=>l4Save(e.currentTarget);l4nRender()}
function l4nRead(){if(!L4N)return;const c=$('l4cl');if(c)L4N.clinic=c.value;const q=$('l4pq');if(q)L4N.pq=q.value}
function l4nPats(){if(!L4N||!L4N.res.length)return L4N&&L4N.pq.trim().length>1?'<div class="meta">بیماری با این نام پیدا نشد.</div>':'';return L4N.res.map((p,i)=>`<button type="button" class="btn sm ghost l4pp" data-l4pick="${i}">${esc(p.name)}${p.age?' · '+esc(faD(p.age)):''}${p.doc?' · '+esc(p.doc):''}</button>`).join('')}
function l4nRender(fresh){const body=$('l4nBody');if(!body||!L4N||!LO)return;l4nRead();if(!fresh)try{h9Read()}catch(e){}const sc=body.closest('.in'),top=sc?sc.scrollTop:0,N=L4N,H=LO.h9;
  const pat=N.mode==='site'?(N.pid?`<div class="l4pick"><b>${esc(H.name)}</b> <small class="meta">بیمار پرونده‌دار سایت</small> <button type="button" class="btn sm ghost" data-l4unpick>تغییر بیمار</button></div>`
      :`<input id="l4pq" autocomplete="off" placeholder="نام یا کد ملی بیمار را بنویسید" value="${esc(N.pq)}"><div class="l4pr" id="l4pr">${l4nPats()}</div>`)
    :`<label class="f">نام کلینیک<input id="l4cl" value="${esc(N.clinic)}" placeholder="مثلاً کلینیک ارکیده"></label><small class="note">نام بیمار و پزشک را در برگه‌ی پایین بنویسید.</small>`;
  let sheet=h9HTML({data:{},pros:{},surg:{}}).replace(/<span>ساخت برای:<\/span>[\s\S]*?(?=<span>روش قالب‌گیری:)/,'');
  const files=`<div class="h9drop" id="h9Drop" role="button" tabindex="0" aria-label="انتخاب فایل اسکن یا عکس" data-l8d="1"><b>بارگذاری فایل اسکن / عکس</b><span>برای انتخاب فایل اینجا بزنید، یا فایل را بکشید و اینجا رها کنید</span></div><div class="grp l3files"><span>STL، PLY، OBJ، ZIP، عکس، PDF (اختیاری)</span><label class="btn sm ghost" style="width:fit-content">📎 انتخاب فایل یا عکس<input type="file" id="lo_files" multiple hidden accept=".stl,.ply,.obj,.zip,.rar,.7z,.dcm,.3oxz,.constructioninfo,.jpg,.jpeg,.jfif,.png,.webp,.heic,.heif,.gif,.bmp,.tif,.tiff,.pdf,.mp4,.mov"></label>${LOF.length?`<ul class="l3fl">${LOF.map((f,i)=>`<li><span dir="ltr">${esc(f.name)}</span> <small>${l2Size(f.size)}</small><button class="btn sm ghost" type="button" data-lofx="${i}" aria-label="حذف">×</button></li>`).join('')}</ul>`:''}</div>`;
  body.innerHTML=`<div class="grp l4stage"><span>مرحله‌ی کار <small class="note">(کار در همین تب می‌نشیند)</small></span><div class="chips">${L4T.map(([k,l])=>`<button type="button" class="chip" data-lofor="${k}" aria-pressed="${LO.for===k}">${l}</button>`).join('')}</div></div>
    <div class="grp"><span>بیمار</span><div class="seg l4mode"><button type="button" data-l4m="site" aria-pressed="${N.mode==='site'}">بیمار پرونده‌دار سایت</button><button type="button" data-l4m="ext" aria-pressed="${N.mode==='ext'}">بیمار کلینیک دیگر</button></div>${pat}</div>
    <div class="payform h9form">${sheet}${files}</div>`;
  const q=$('l4pq');if(q)q.oninput=()=>{N.pq=q.value;clearTimeout(N.t);N.t=setTimeout(async()=>{const n=++N.n,v=l4Num(N.pq).trim();if(v.length<2){N.res=[];const r=$('l4pr');if(r)r.innerHTML='';return}
    try{const j=await api('lab4Pats',{q:v});if(n!==N.n||!L4N)return;N.res=j.items||[];const r=$('l4pr');if(r)r.innerHTML=l4nPats()}catch(e){}},300)};
  if(sc)sc.scrollTop=top}
(function(){const _rf=renderFile;renderFile=function(){const s=$('l4nSheet');if(L4N&&s&&!s.hidden){l4nRender();return}return _rf.apply(this,arguments)}})();
function l4Pick(p){const H=LO.h9,M=p.map||{},K=Object.keys(M);L4N.pid=p.id;H.name=p.name||'';H.age=p.age||'';if(p.doc&&!H.doc)H.doc=p.doc;if(p.brand)H.brand=p.brand;
  H.base=(K.length?K.filter(k=>M[k]==='a'):(p.imp||[])).filter(isTooth);H.pon=K.filter(k=>M[k]==='p').filter(isTooth);try{h9Apply()}catch(e){}l4nRender(true)}
async function l4Save(b){const m=$('l4nMsg'),err=t=>{m.className='msg err';m.textContent=t;m.scrollIntoView({block:'center'})};if(!L4N||!LO)return;
  if(V9&&V9.on)return err('اول ضبط صدا را تمام کنید.');
  l4nRead();try{h9Read();h9Apply()}catch(e){}const H=LO.h9,N=L4N;
  if(!LFOR[LO.for]||!l4Lbl(LO.for))return err('مرحله‌ی کار را انتخاب کنید.');
  if(N.mode==='site'&&!N.pid)return err('بیمار را جست‌وجو و انتخاب کنید، یا «بیمار کلینیک دیگر» را بزنید.');
  if(N.mode==='ext'){if(!String(H.name||'').trim())return err('نام بیمار را در برگه بنویسید.');if(!String(N.clinic||'').trim())return err('نام کلینیک را بنویسید.')}
  if(!LO.due)return err('تاریخ تحویل را درست وارد کنید.');
  if(!LO.teeth.length&&!H.draw&&!v9Files().length)return err('دندان‌ها (پایه/پونتیک) را روی برگه بزنید یا توضیح بنویسید.');
  b.disabled=true;if(!b.dataset.sid)b.dataset.sid=uuid();if(!b.dataset.lid)b.dataset.lid=uuid();const lid=b.dataset.lid,f0=LO.for;
  let files=LOF.slice();try{const sh=await h9Sheet();files.unshift(sh)}catch(e){}files=files.concat(v9Files());
  m.className='msg';m.textContent='در حال ثبت…';
  try{const r=await api('lab4New',{id:N.mode==='site'?N.pid:'',name:H.name,clinic:N.mode==='ext'?N.clinic:'',lid,due:LO.due,sendId:b.dataset.sid,
      order:{for:LO.for,meth:LO.meth,teeth:LO.teeth,pon:(LO.pon||[]).filter(k=>LO.teeth.includes(k)),type:LO.type,mat:LO.mat,abut:LO.abut,ret:LO.ret,shade:LO.shade,sys:LO.sys,doc:LO.doc||H.doc,note:LO.note,by:USERNAME||'لابراتوار'}});
    let bad='';for(let i=0;i<files.length;i++){const f=files[i];try{await l2Upload(lid,f,/\.(jpe?g|png|webp|heic)$/i.test(f.name)?'photo':'scan',q=>{m.textContent=`بارگذاری فایل ${fa(i+1)} از ${fa(files.length)}: ${f.name} — ${fa(Math.round(q*100))}٪`})}catch(e){bad=f.name+': '+e.message;break}}
    $('l4nSheet').hidden=true;L4N=null;LO=null;LOF=[];LB.seg='s_'+f0;TILE='s_'+f0;
    if(bad)alertMsg('کار ثبت شد ولی بارگذاری فایل کامل نشد ('+bad+'). از «جزئیات و فایل‌ها» دوباره بگذارید.');
    toast(`کار #${l2No(r.no)} در تب «${l4Lbl(f0)}» ثبت شد.`);pollLab(true)}
  catch(e){err(e.message);b.disabled=false}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-l4new],[data-l4find],[data-l4ready],[data-l4open],[data-l4m],[data-l4pick],[data-l4unpick]');if(!t)return;
  if(t.hasAttribute('data-l4new')){l4New();return}
  if(t.hasAttribute('data-l4find')){l4Search();return}
  if(t.dataset.l4ready){e.stopPropagation();l4Ready(t.dataset.l4ready,t);return}
  if(t.dataset.l4open){const q=$('l4sSheet');if(q)q.hidden=true;l2Open(t.dataset.l4open);return}
  if(!L4N)return;
  if(t.dataset.l4m){l4nRead();L4N.mode=t.dataset.l4m;l4nRender();return}
  if(t.dataset.l4pick!==undefined){const p=L4N.res[Number(t.dataset.l4pick)];if(p)l4Pick(p);return}
  if(t.hasAttribute('data-l4unpick')){L4N.pid='';L4N.res=[];L4N.pq='';LO.h9.name='';LO.h9.age='';LO.h9.base=[];LO.h9.pon=[];l4nRender(true);return}});
/* the prosthesis doctor must pick the stage */
(function(){const _i=loInit;loInit=function(){const r=_i.apply(this,arguments);try{if(LO)LO.for=''}catch(e){}return r};
  const _s=loSend;loSend=async function(t){if(LO&&!LFOR[LO.for]){const m=$('loMsg');if(m){m.className='msg err';m.textContent='«ساخت برای» را انتخاب کنید: رزین پیچ‌شونده، رزین اباتمنت، کار نهایی یا اباتمنت.'}return}return _s.apply(this,arguments)};
  const _l=l5Submit;l5Submit=async function(withLab,b){if(withLab&&LO&&!LFOR[LO.for]){const m=$('l5Msg');if(m){m.className='msg err';m.textContent='در برگه‌ی دستورکار «ساخت برای» را انتخاب کنید: رزین پیچ‌شونده، رزین اباتمنت، کار نهایی یا اباتمنت.';m.scrollIntoView({block:'center'})}return}return _l.apply(this,arguments)}})();

