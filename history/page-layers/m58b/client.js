
/* ---------- m58b (owner, 2026-11-20): «سفارش لابراتوار» from the prosthesis card — no field of the work order is mandatory ---------- */
var M58L='';
(function(){const _o=openFile;openFile=function(){M58L='';return _o.apply(this,arguments)}})();
window.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('[data-m58lab]');if(!t)return;e.stopImmediatePropagation();const id=t.dataset.m58lab;
  await l3OpenLab(id,t.dataset.m58n||'',t.dataset.aid||'');if(PF&&PF.id===id&&LO){M58L=id;try{renderFile()}catch(x){}}},true);
/* no auto-open of the پایه / پونتیک chart for this order */
(function(){const _o=openPmap;openPmap=async function(id){if(M58L&&M58L===id&&LO&&PF&&PF.id===id)return;return _o.apply(this,arguments)}})();
async function m58Send(t){const m=$('loMsg');try{loRead()}catch(e){}
  try{if(LO.h9){try{h9Apply()}catch(e){}try{const f=await h9Sheet();LOF=LOF.filter(x=>!/^برگه-دستورکار-/.test(x.name));LOF.unshift(f)}catch(e){}
    try{const V=v9Files();LOF=LOF.filter(f=>!V9EXT.test(f.name)).concat(V)}catch(e){}}}catch(e){}
  t.disabled=true;if(!t.dataset.sid)t.dataset.sid=uuid();if(!t.dataset.lid)t.dataset.lid=uuid();const pid=PF.id,lid=t.dataset.lid,files=LOF.slice(),doc=LO.doc,teeth=(LO.teeth||[]).slice();
  try{await api('labNew',{id:pid,lid,order:{m58:1,for:LO.for||'',meth:LO.meth,teeth,pon:(LO.pon||[]).filter(k=>teeth.includes(k)),type:LO.type,mat:LO.mat,abut:LO.abut,ret:LO.ret,shade:LO.shade,sys:LO.sys,doc:LO.doc,note:LO.note||'',by:USERNAME||ROLE_LBL[ROLE]},due:LO.due||'',sendId:t.dataset.sid})}
  catch(e){m.className='msg err';m.textContent=e.message;t.disabled=false;return}
  let bad='';for(let i=0;i<files.length;i++){const f=files[i];try{await l2Upload(lid,f,/\.(jpe?g|png|webp|heic)$/i.test(f.name)?'photo':'scan',p=>{m.className='msg';m.textContent=`بارگذاری فایل ${fa(i+1)} از ${fa(files.length)}: ${f.name} — ${fa(Math.round(p*100))}٪`})}catch(e){bad=f.name+': '+e.message;break}}
  const ap=L3.plan===pid&&L3.aid?L3.aid:((PF.j.appts||[]).find(a=>a.day===tDay()&&a.st==='set'&&l3K(a.kind))||{}).id;
  if(ap&&ROLE==='surgery'){try{await api('apptSet',{aid:ap,st:'done',doc:USERNAME||doc||''})}catch(e){}}
  try{if(l3Of(pid))await api('prosRef',{id:pid,op:'clear'})}catch(e){}
  LO=null;LOF=[];L3={plan:'',aid:''};M58L='';
  if(bad){alertMsg('سفارش به لابراتوار رفت ولی بارگذاری فایل کامل نشد ('+bad+'). از «مراحل، فایل‌ها و اسکن» در همین پرونده دوباره بگذارید.');toast('سفارش رفت؛ فایل کامل نشد.',1)}
  else toast(files.length?`سفارش با ${fa(files.length)} فایل به لابراتوار رفت.`:'سفارش به لابراتوار رفت.');
  refreshFile();pollQ(true);try{if(!$('viewPros').hidden)loadPros();if(!$('viewPday').hidden)loadPday()}catch(e){}}
(function(){const _s=loSend;loSend=async function(t){if(M58L&&PF&&PF.id===M58L&&LO)return m58Send(t);return _s.apply(this,arguments)}})();
/* say it on the form */
(function(){const _f=loForm;loForm=function(j){const h=_f.apply(this,arguments);if(!(M58L&&PF&&PF.id===M58L))return h;
  return h.replace('<div class="msg" id="loMsg"></div>','<p class="note m58o">هیچ فیلدی اجباری نیست؛ هرچه لازم است پر کنید. تاریخ خالی = ۱۰ روز بعد؛ دندان‌ها خالی = پایه و پونتیک پرونده.</p><div class="msg" id="loMsg"></div>')}})();
