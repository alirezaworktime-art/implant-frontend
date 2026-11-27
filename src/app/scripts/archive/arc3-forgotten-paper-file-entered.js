/* ---------- arc3: a forgotten (paper) file is entered on the surgery-day page: patient data on top, then one or more
   dated surgery sessions (each with the surgery-day treatment tables, implants, surgeon and assistants); costs / earlier
   payments and the file status stay at the bottom ---------- */
const ARC_DOC='پزشک کلینیک';
let ARCT=null; // where the surgery-day team box lives normally
function arcSes0(c){return {dayJ:'',by:c?c.by||'':'',asst:c?c.asst||'':'',sa:{},sa2:{},st:{},s:blankSections(),imp:{}}}
function arcStash(){const A=SURG&&SURG.arc;if(!A)return;const c=A.ses[A.cur];if(!c)return;
  Object.assign(c,{s:SURG.s,imp:SURG.imp,asst:SURG.asst,sa:SURG.sa,sa2:SURG.sa2,st:SURG.st,by:$('sg_by').value.trim(),dayJ:$('arc_day').value.trim()})}
function arcLoad(i){const A=SURG.arc;A.cur=Math.max(0,Math.min(i,A.ses.length-1));const c=A.ses[A.cur];
  Object.assign(SURG,{s:c.s,imp:c.imp,asst:c.asst||'',sa:c.sa||{},sa2:c.sa2||{},st:c.st||{}});SURG.openSecs=new Set();
  $('sg_by').value=c.by||'';$('arc_day').value=c.dayJ||'';$('sgArcMsg').textContent='';renderAsst();arcBar();renderSurg()}
function arcBar(){const A=SURG&&SURG.arc;if(!A)return;
  $('arcSesBar').innerHTML=A.ses.map((c,i)=>{const pv={s:c.s,brand:'ko',pay:{}},n=SECTIONS.filter(x=>rowUsed(pv,x)).length;
    return `<button type="button" class="chip" data-arcses="${i}" aria-pressed="${i===A.cur}">جلسه‌ی ${fa(i+1)}${c.dayJ?' · '+esc(faD(c.dayJ)):''}${n?' ✓':''}</button>`}).join('')+
    `<button type="button" class="chip arcadd" id="arcSesAdd">+ جلسه‌ی جراحی دیگر</button>`;
  $('arcSesDel').hidden=A.ses.length<2;$('arcSesDel').textContent='حذف جلسه‌ی '+fa(A.cur+1);delete $('arcSesDel').dataset.sure;
  $('arcSesT').textContent='جلسه‌ی '+fa(A.cur+1)+' از '+fa(A.ses.length)}
function arcDocs(){return [...new Set([...(SET.docs||[]),SURGEON(),...ASSTS(),ARC_DOC].filter(Boolean))]}
/* the surgery-day page in archive mode */
function arcPage(j){
  const back=['list','queue','recep'].find(v=>{const el=$('view'+v[0].toUpperCase()+v.slice(1));return el&&!el.hidden})||'list';
  const pf=$('pfSheet'),file=pf&&!pf.hidden&&PF&&PF.id?PF.id:'';if(pf&&!pf.hidden)pf.hidden=true;
  show('surg');
  const rec=blankForm();rec.id=j&&j.id||'arc-new';const d=j&&j.data||{};rec.h=Object.assign(rec.h,d.h||{});
  F=blankForm();
  const sg=(j&&j.surg)||{},old=(sg.sessions||[]).filter(x=>x&&x.arc);
  const ses=old.map(x=>({dayJ:x.at?jDay(String(x.at).slice(0,10)):'',by:x.by||'',asst:x.asst||'',sa:Object.assign({},x.sa||{}),sa2:Object.assign({},x.sa2||{}),st:JSON.parse(JSON.stringify(x.st||{})),s:secFrom(x.s||{}),imp:JSON.parse(JSON.stringify(x.imp||{})),uncN:num(x.uncN)}));
  if(!ses.length)ses.push(arcSes0());
  SURG={id:rec.id,rec,prev:[],plan:blankSections(),s:ses[0].s,need:{},imp:ses[0].imp,sid:uuid(),asst:'',sa:{},sa2:{},st:{},unc:3,uncT:false,openSecs:new Set(),
    arc:{ses,cur:0,back,file,name:(d.h||{}).name||'',edit:!!j,more:(sg.sessions||[]).length-old.length}};
  const V=$('viewSurg');V.classList.add('arcm');
  [$('sgPlan').closest('section'),$('sgPhoto'),$('sgMeta'),$('sgMed'),$('sgStaff'),document.querySelector('#viewSurg [data-fu]').closest('.grp'),$('sgUncM'),$('sg_tmp')&&$('sg_tmp').closest('label'),$('sg_fin').closest('label'),$('sgMsg'),$('sgSave').closest('.btns'),$('sgImpW').closest('section').querySelector('h2')].forEach(el=>{if(el)el.classList.add('arcx')});
  const tm=document.querySelector('#viewSurg .sgteam');if(tm){if(!ARCT)ARCT=tm.parentNode;$('arcTeam').appendChild(tm)}
  const asp=document.querySelector('#viewSurg .sgteam .grp>span');if(asp)asp.textContent='پزشک دستیار این جلسه *';
  $('sgName').textContent=j?'ویرایش پرونده‌ی جا مانده (بایگانی)':'افزودن پرونده‌ی جا مانده (بیماران قبلی / پرونده‌ی کاغذی)';
  $('sgArcPat').hidden=false;$('sgArcSes').hidden=false;$('arcBot').hidden=false;$('sgArcMore').hidden=!SURG.arc.more;
  $('sgArcMore').textContent=SURG.arc.more?fa(SURG.arc.more)+' جلسه‌ی جراحی بعدی این بیمار در خود سایت ثبت شده و این‌جا تغییر نمی‌کند.':'';
  $('dlSgDoc').innerHTML=arcDocs().map(n=>`<option value="${esc(n)}">`).join('');
  arcLoad(0);if(CF_ON)pollInv(true)}
function arcUndo(){const V=$('viewSurg');if(!V||!V.classList.contains('arcm'))return;V.classList.remove('arcm');
  const tm=$('arcTeam')&&$('arcTeam').querySelector('.sgteam');if(tm&&ARCT)ARCT.appendChild(tm);
  ['sgArcPat','sgArcSes','arcBot','fxArcSheet'].forEach(id=>{const el=$(id);if(el)el.hidden=true});$('sgArcPat').innerHTML='';
  const c=$('sgImpW').closest('section');if(c)c.hidden=false;const asp=document.querySelector('#viewSurg .sgteam .grp>span');if(asp)asp.textContent='پزشک دستیار امروز *'}
function arcExit(reopen){const A=SURG&&SURG.arc,b=(A&&A.back)||'list';FXA=null;show(b);if(b==='list')try{renderList()}catch(e){}if(reopen&&A&&A.file)openFile(A.file,A.name,'tl')}
/* patient data on top, money and status at the bottom (the old sheet's fields, so reading and saving stay the same) */
function arcRender(){const A=FXA,docs=arcDocs();
  $('sgArcPat').innerHTML=`<p class="note">برای بیماران قبلی که پرونده‌ی کاغذی دارند: مشخصات بیمار، و پایین‌تر هر جلسه‌ی جراحی با تاریخ خودش (مثل صفحه‌ی روز جراحی). بعد از ذخیره، اسکن یا عکس پرونده‌ی کاغذی را در بخش «تصاویر» پرونده اضافه کنید.</p>
  <datalist id="fxDocs">${docs.map(b=>`<option value="${esc(b)}">`).join('')}</datalist>
  <div class="arcg">
   <label class="f">نام و نام خانوادگی *<input id="fxa_name" value="${esc(A.name||'')}"></label><label class="f">شماره پرونده‌ی کاغذی<input id="fxa_file" maxlength="20" value="${esc(faD(A.file||''))}"></label>
   <label class="f">موبایل<input id="fxa_phone" inputmode="tel" value="${esc(faD(A.phone||''))}"></label><label class="f">کد ملی<input id="fxa_nid" inputmode="numeric" value="${esc(faD(A.nid||''))}"></label>
   <label class="f">سن<input id="fxa_age" inputmode="numeric" value="${esc(faD(A.age||''))}"></label><label class="f">شهر<input id="fxa_city" value="${esc(A.city||'')}"></label>
   <label class="f">پزشک پرونده<input id="fxa_doc" list="fxDocs" value="${esc(A.doc||'')}"></label><label class="f">تاریخ اولین مراجعه<input id="fxa_day" placeholder="۱۴۰۲/۰۳/۱۵" value="${esc(A.dayJ||'')}"></label></div>`;
  fxSheet('fxArcSheet',`<h2>هزینه‌ها، پرداخت‌های قبلی و وضعیت پرونده</h2>
  ${fx2VisitsHtml(A)}
  <label class="f">درمان‌های دیگر (اگر در جلسه‌های بالا نیامده)<textarea id="fxa_other" rows="2" maxlength="2000">${esc(A.other||'')}</textarea></label>
  <label class="f">توضیحات<textarea id="fxa_note" rows="2" maxlength="3000">${esc(A.note||'')}</textarea></label>
  ${A.id?'':`<div class="grp"><span>وضعیت پرونده</span><div class="chips" role="group"><button class="chip" type="button" data-fxaopen="0" aria-pressed="${!A.open}">بسته — درمان تمام شده</button><button class="chip" type="button" data-fxaopen="1" aria-pressed="${!!A.open}">باز — ادامه‌ی درمان</button></div></div>
  <div id="fxaOpenW" class="arcg"${A.open?'':' hidden'}>
   <label class="f">نوع پروتز<select id="fxa_type">${Object.keys(FX_TY).map(k=>`<option value="${k}"${k===(A.type||'fix')?' selected':''}>${FX_TY[k]}</option>`).join('')}</select></label>
   <label class="f">مرحله‌ی فعلی<select id="fxa_stage">${fxStOpts(A.type||'fix',A.stage||'imprw')}</select></label>
   <label class="f">تاریخ پیگیری / نوبت (برای آنکاوری یا قالب)<input id="fxa_due" placeholder="امروز" value="${esc(A.dueJ||'')}"></label></div>`}
  <div class="msg" id="fxaMsg"></div>
  <div class="btns"><button class="btn" type="button" id="fxaGo">${A.id?'ذخیره‌ی تغییرات':'ثبت پرونده در بایگانی'}</button><button class="btn ghost" type="button" id="arcCancel">انصراف</button></div>`)}
{const _r=fxArcRender;fxArcRender=function(){if(SURG&&SURG.arc)return arcRender();return _r.apply(this,arguments)}}
{const _o=fxArcOpen;fxArcOpen=function(j){arcPage(j);return _o.apply(this,arguments)}}
{const _s=fxArcSave;fxArcSave=function(btn){if(SURG&&SURG.arc)return arcSave(btn);return _s.apply(this,arguments)}}
{const _sh=show;show=function(v){if(v!=='surg'||(SURG&&!SURG.arc))arcUndo();return _sh.apply(this,arguments)}}
{const _ri=renderImps;renderImps=function(){const r=_ri.apply(this,arguments);if(SURG&&SURG.arc){const c=$('sgImpW').closest('section');if(c)c.hidden=$('sgImpW').hidden}return r}}
/* fixtures the All on X / overdenture count asks for in jaw j of sections S */
const arcAsk=o=>typeof uxAsk==='function'?uxAsk(o):Promise.resolve(window.confirm(o.msg||o.title));
const arcWant=(S,id,j)=>Object.keys(S[id].sel).filter(k=>S[id].sel[k]&&!isTooth(k)&&k.split(':')[0]===(j==='U'?'0':'1')).reduce((a,k)=>a+num(k.split(':')[1]),0);
async function arcSave(btn){const A=fxArcRead(),m=$('fxaMsg');
  const err=(t,i)=>{if(i!==undefined){if(i!==SURG.arc.cur){arcStash();arcLoad(i)}const sm=$('sgArcMsg');sm.className='msg err';sm.textContent=t;$('sgArcSes').scrollIntoView({behavior:'smooth',block:'start'})}m.className='msg err';m.textContent=t};
  if(!A.name){err('نام بیمار را بنویسید.');$('fxa_name').focus();return}
  const day=A.dayJ?parseJ(A.dayJ):'';if(A.dayJ&&!day)return err('تاریخ اولین مراجعه درست نیست.');if(day&&day>tDay())return err('تاریخ اولین مراجعه نمی‌تواند بعد از امروز باشد.');
  const due=A.dueJ?parseJ(A.dueJ):'';if(A.dueJ&&!due)return err('تاریخ پیگیری درست نیست.');
  const bv=(A.visits||[]).find(x=>(x.dayJ||x.svc||x.cost||x.paid||x.note||x.teeth)&&!x.day);if(bv)return err('تاریخ هر مراجعه را درست وارد کنید'+(bv.dayJ?' («'+bv.dayJ+'»)':'')+'.');
  if((A.visits||[]).some(x=>x.day&&x.day>tDay()))return err('تاریخ مراجعه نمی‌تواند بعد از امروز باشد.');
  arcStash();const S=SURG.arc.ses,ses=[],imps=[];
  for(let i=0;i<S.length;i++){const c=S[i],pv={s:c.s,brand:'ko',pay:{}},used=SECTIONS.filter(x=>rowUsed(pv,x)),L='جلسه‌ی '+fa(i+1)+': ';
    const ik=IMPSECS.flatMap(id=>Object.keys(c.s[id].sel).filter(k=>c.s[id].sel[k]&&isTooth(k))).sort();
    if(!used.length&&!ik.length&&!num(c.uncN)){if(!c.dayJ)continue;return err(L+'هیچ کاری علامت نخورده. از فهرست‌های کنار صفحه کار را باز کنید و علامت بزنید، یا این جلسه را حذف کنید.',i)}
    const dd=parseJ(c.dayJ);if(!dd)return err(L+(c.dayJ?'تاریخ «'+c.dayJ+'» درست نیست؛ مثل ۱۴۰۲/۰۳/۱۵ بنویسید.':'تاریخ جلسه را بنویسید.'),i);
    if(dd>tDay())return err(L+'تاریخ جلسه نمی‌تواند بعد از امروز باشد.',i);
    if(!c.by)return err(L+'نام جراح را بنویسید؛ اگر در پرونده معلوم نیست «'+ARC_DOC+'» را بزنید.',i);
    const needA=used.some(x=>!SOLO.includes(x.id));
    if(needA&&!c.asst)return err(L+'پزشک دستیار را انتخاب کنید؛ اگر معلوم نیست «'+ARC_DOC+'» را بزنید.',i);
    const bad=[];SECTIONS.filter(x=>x.sgt).forEach(x=>['U','L'].forEach(j=>{const w=arcWant(c.s,x.id,j),g=teethSel(c.s[x.id],j);if(w!==g)bad.push(x.t+' '+(j==='U'?'فک بالا':'فک پایین')+': '+fa(w)+' پایه، ولی '+fa(g)+' دندان زده شده')}));
    if(bad.length)return err(L+bad.join('؛ '),i);
    const imp={};ik.forEach(k=>{imp[k]=c.imp[k]?Object.assign({},c.imp[k]):{b:'',sys:'',g:'',d:'',l:'',ht:'',hs:'',rs:'new',note:'پرونده‌ی کاغذی'}});
    const sa={},sa2={},st={};used.forEach(x=>{if(SOLO.includes(x.id))return;if(c.sa[x.id]&&c.sa[x.id]!==c.asst)sa[x.id]=c.sa[x.id];if(c.sa2[x.id]){sa2[x.id]=c.sa2[x.id];const mm=c.st[x.id]||{},o={};p5Units(c.s[x.id]).forEach(k=>{if(mm[k]===c.sa2[x.id])o[k]=mm[k]});if(Object.keys(o).length)st[x.id]=o}});
    ses.push({day:dd,by:c.by,asst:needA?c.asst:'',sa,sa2,st,s:secDoc(c.s),imp,uncN:num(c.uncN)});
    ik.forEach(k=>{const v=imp[k];imps.push({t:k,b:v.b||'',sys:v.sys||'',g:v.g||'',d:v.d||'',l:v.l||'',day:dd,by:c.by})})}
  m.textContent='';$('sgArcMsg').textContent='';
  const arc={name:A.name,phone:A.phone,nid:A.nid,age:A.age,city:A.city,doc:A.doc,file:A.file,day,other:A.other,note:A.note,open:!!A.open,type:A.type,stage:A.stage,due,ses,imps,cost:arcCostAll().tot,
    visits:(A.visits||[]).filter(x=>x.day).map(x=>({day:x.day,svc:x.svc,teeth:x.teeth,doc:x.doc,cost:x.cost,paid:x.paid,method:x.method,no:x.no,note:x.note}))};
  btn.disabled=true;try{const r=await api('fxArc',{id:A.id||'',arc,by:fxBy()},{timeout:25000});const ed=!!A.id;
    toast(ed?'اطلاعات بایگانی ذخیره شد.':'پرونده‌ی جا مانده ثبت شد؛ اسکن پرونده را در «تصاویر» اضافه کنید.');
    arcExit();try{loadList()}catch(e){}pollQ(true);openFile(r.id,arc.name,ed?'tl':'img')}
  catch(e){m.className='msg err';m.textContent=e.message}finally{btn.disabled=false}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(!t||!SURG||!SURG.arc)return;const d=t.dataset;
  const stop=()=>{e.preventDefault();e.stopPropagation();['sgArcMsg','fxaMsg'].forEach(k=>{const el=$(k);if(el&&el.classList.contains('err'))el.textContent=''})};
  if(d.arcses!==undefined){stop();arcStash();arcLoad(Number(d.arcses));return}
  if(t.id==='arcSesAdd'){stop();arcStash();const A=SURG.arc;A.ses.push(arcSes0(A.ses[A.cur]));arcLoad(A.ses.length-1);$('arc_day').focus();return}
  if(t.id==='arcSesDel'){stop();const A=SURG.arc,n=A.cur;arcAsk({title:'حذف جلسه‌ی '+fa(n+1),msg:'کارها و ایمپلنت‌های این جلسه از این فرم پاک می‌شود.',ok:'حذف جلسه',danger:true}).then(y=>{if(!y||!SURG||SURG.arc!==A)return;A.ses.splice(n,1);arcLoad(Math.max(0,n-1))});return}
  if(d.arcby!==undefined){stop();$('sg_by').value=ARC_DOC;arcStash();renderSurg();return}
  if(d.sgas!==undefined){stop();SURG.asst=d.sgas;renderAsst();renderSurg();return} /* the archive never changes «today's assistant» of the real surgery day */
  if(t.id==='arcCancel'){stop();const A=SURG.arc;arcAsk({title:'خروج بدون ذخیره',msg:'اطلاعاتی که در این صفحه وارد کرده‌اید ذخیره نمی‌شود.',ok:'خروج',danger:true}).then(y=>{if(y&&SURG&&SURG.arc===A)arcExit(true)});return}},true);
document.addEventListener('input',e=>{if(!SURG||!SURG.arc)return;if(e.target.id==='arc_day'){arcStash();arcBar()}});
document.addEventListener('change',e=>{if(!SURG||!SURG.arc)return;if(e.target.id==='arc_day'){arcStash();arcBar()}if(e.target.id==='sg_by'){arcStash();renderSurg()}});

