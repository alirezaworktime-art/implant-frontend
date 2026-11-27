/* ---------- m47a (owner, 2026-11-17): «جلسه‌ی پروتز» — first the work of the session (type + the tooth chart with پایه / پونتیک), and at the end of it
   the button «ارسال کار برای لابراتوار». The lab work order (the sheet, the delivery date, files) opens only with that button; none of its fields is mandatory
   and the files are uploaded in the same place. Without the button the session is stored alone («ثبت جلسه»). ---------- */
function m47Fill(){try{const H=LO&&LO.h9,pt=(L5&&L5.pt)||{};if(!H)return;const K=Object.keys(pt).filter(isTooth);if(!K.length)return;
  if(L5.m47src===undefined||L5.m47src===JSON.stringify([H.base,H.pon])){H.base=K.filter(k=>pt[k]==='a');H.pon=K.filter(k=>pt[k]==='p');L5.m47src=JSON.stringify([H.base,H.pon]);try{h9Apply()}catch(e){}}}catch(e){}}
function m47Paint(){if(!L5||!PF||PF.sess!==L5||!L5.work)return;const w=document.querySelector('#pfBody .l5work');if(!w)return;const f=w.querySelector('.h9form')||w.querySelector('.payform');if(!f)return;
  const nt=[...w.querySelectorAll('p.note')].find(p=>/سفارش لابراتوار اختیاری/.test(p.textContent||''));if(nt)nt.classList.add('m47hide');
  const acts=$('pfActs'),lab=acts&&acts.querySelector('#l5Lab'),sv=acts&&acts.querySelector('#l5Save');
  if(!L5.m47){f.classList.add('m47hide');f.insertAdjacentHTML('beforebegin','<div class="m47go"><button class="btn main" type="button" id="m47Go">ارسال کار برای لابراتوار</button><p class="note">اگر کار این جلسه به لابراتوار می‌رود این دکمه را بزنید تا دستورکار باز شود. اگر نمی‌رود، پایین صفحه «ثبت جلسه» را بزنید.</p></div>');
    if(lab)lab.remove();if(sv){sv.textContent='ثبت جلسه';sv.className='btn main'}}
  else{f.classList.add('m47open');f.insertAdjacentHTML('beforebegin','<div class="m47hd" id="m47Hd"><b>دستورکار لابراتوار</b><button class="btn ghost sm" type="button" id="m47No">بستن دستورکار</button><p class="note">هیچ فیلدی اجباری نیست؛ هرچه لازم است پر کنید و فایل اسکن / عکس را همین‌جا بگذارید. دندان‌های پایه و پونتیک از همین جلسه آمده است. تاریخ تحویل خالی = ۱۰ روز بعد.</p></div>');
    if(lab)lab.textContent='ثبت جلسه و ارسال به لابراتوار';if(sv)sv.textContent='ثبت جلسه بدون ارسال به لابراتوار'}}
{const _r=l5Render;l5Render=function(){try{if(L5&&L5.m47)m47Fill()}catch(e){}const r=_r.apply(this,arguments);try{m47Paint()}catch(e){console.error('m47a',e)}return r}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#m47Go,#m47No');if(!t||!L5||!PF||PF.sess!==L5)return;e.preventDefault();e.stopImmediatePropagation();l5Read();
  if(t.id==='m47Go'){L5.m47=1;m47Fill();renderFile();setTimeout(()=>{try{const h=$('m47Hd');if(h)h.scrollIntoView({block:'start',behavior:'smooth'})}catch(x){}},30)}
  else{L5.m47=0;renderFile()}},true);
async function m47Submit(b){if(typeof V9!=='undefined'&&V9&&V9.on){alertMsg('اول ضبط صدا را تمام کنید.');return}
  l5Read();const m=$('l5Msg'),s=L5,err=t=>{m.className='msg err';m.textContent=t;m.scrollIntoView({block:'center'})};
  /* the session itself: the same checks as before */
  if(!s.work)return err('کار این جلسه را انتخاب کنید.');if((s.work==='rscr'||s.work==='rabt')&&!s.res)return err('نتیجه‌ی امتحان را بزنید.');if((s.work==='other'||s.res==='redo')&&!String(s.note).trim())return err('توضیح را بنویسید.');
  if(PK4_TEETH[s.work]&&!Object.keys(s.pt||{}).length)return err('دندان‌های پایه / پونتیک این جلسه را روی شکل بزنید.');if(s.work==='cem'&&!s.cem)return err('نوع چسب را انتخاب کنید (Kerr / GC / PC).');
  /* the work order: nothing is mandatory */
  b.disabled=true;m.className='msg';m.textContent='در حال ثبت…';
  try{const H=LO.h9;
    if(H){try{h9Apply()}catch(e){}if((H.base||[]).length){try{await h9Map()}catch(e){}}
      try{const f=await h9Sheet();LOF=LOF.filter(x=>!/^برگه-دستورکار-/.test(x.name));LOF.unshift(f)}catch(e){}
      try{const V=v9Files();LOF=LOF.filter(f=>!V9EXT.test(f.name)).concat(V)}catch(e){}}
    const teeth=(LO.teeth||[]).slice(),p={id:PF.id,aid:s.aid,work:s.work,result:s.res,note:s.note,by:USERNAME||ROLE_LBL[ROLE]};
    if(s.work==='impr')p.imp={meth:LO.meth,shade:LO.shade,abut:LO.abut,ret:LO.ret};
    p.lid=uuid();if(LO.due)p.due=LO.due;
    p.order={m47:1,for:LO.for||'',meth:LO.meth,teeth,pon:(LO.pon||[]).filter(k=>teeth.includes(k)),type:LO.type,mat:LO.mat,abut:LO.abut,ret:LO.ret,shade:LO.shade,sys:LO.sys,doc:LO.doc,note:LO.note};
    if(!b.dataset.sid)b.dataset.sid=uuid();p.sendId=b.dataset.sid;const files=LOF.slice();
    const r=await api('prosSess',p);let bad='';
    if(r.lid)for(let i=0;i<files.length;i++){const f=files[i];try{await l2Upload(r.lid,f,/\.(jpe?g|png|webp|heic)$/i.test(f.name)?'photo':'scan',q=>{m.textContent=`بارگذاری فایل ${fa(i+1)} از ${fa(files.length)}: ${f.name} — ${fa(Math.round(q*100))}٪`})}catch(e){bad=f.name+': '+e.message;break}}
    LO=null;LOF=[];L5=null;PF.sess=null;$('pfSheet').hidden=true;
    if(bad)alertMsg('جلسه ثبت شد و کار به لابراتوار رفت، ولی بارگذاری فایل کامل نشد ('+bad+'). از «مراحل، فایل‌ها و اسکن» دوباره بگذارید.');
    toast(r.lid?`جلسه ثبت شد و کار${files.length?' با '+fa(files.length)+' فایل':''} به لابراتوار رفت.`:(r.msg||'جلسه ثبت شد.'));
    pollQ(true);try{if(!$('viewPday').hidden)loadPday()}catch(e){}}
  catch(e){err(e.message)}finally{b.disabled=false}}
{const _s=l5Submit;l5Submit=async function(withLab,b){if(withLab&&L5&&L5.m47&&LO&&PF&&PF.sess===L5)return m47Submit(b);return _s.apply(this,arguments)}}
