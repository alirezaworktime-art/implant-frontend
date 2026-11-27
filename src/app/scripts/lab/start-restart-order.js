/* ---------- start / restart an order ---------- */
async function l2StartOpen(lid){const x=LB.items.find(i=>i.id===lid)||(L2.ord&&L2.ord.order&&L2.ord.order.id===lid?Object.assign({},L2.ord.order,{steps:L2.ord.steps}):null);if(!x)return;
  let D;try{D=await l2Defs()}catch(e){alertMsg(e.message);return}const d=x.data||{},steps=x.steps||[],redo=steps.length>0;
  const W=D.wts.filter(w=>w.active),P=D.procs.filter(p=>p.active),S=D.staff.filter(s=>s.active||s.designer),key='l2wt:'+(d.for||'');let lastW='';try{lastW=localStorage.getItem(key)||''}catch(e){}
  const wt0=d.wtid||Number(lastW)||'',firstD=steps.find(s=>/طراح/.test(s.dname));
  const sh=mkSheet('l2StSh',`<h3>${redo?'شروع اصلاح':'دریافت و شروع کار'} — ${esc(x.name)} <span class="meta">#${l2No(x.no)}</span></h3>
    <div class="meta">ساخت: ${esc(LFOR[d.for]||d.for||'—')} · دندان ${esc(l2Teeth(d.teeth)||'—')}${d.shade?' · رنگ '+esc(d.shade):''}${d.redoNote&&x.st==='redo'?`<div class="late">اصلاح خواسته‌شده: ${esc(d.redoNote)}</div>`:''}</div>
    ${redo?`<div class="grp" style="margin-top:8px"><span>از کدام مرحله دوباره ساخته شود؟</span><div class="chips" id="l2From"><button type="button" class="chip" data-from="-1" aria-pressed="${!firstD}">همه‌ی مراحل از نو</button>${steps.map(s=>`<button type="button" class="chip" data-from="${s.idx}" aria-pressed="${firstD&&firstD.idx===s.idx?'true':'false'}">${fa(s.idx+1)}. ${esc(s.dname)}</button>`).join('')}</div></div>`:''}
    <div class="fields" id="l2StF"${redo&&firstD?' hidden':''}><label class="f full">نوع کار<select id="l2wt"><option value="">— انتخاب —</option>${W.map(w=>`<option value="${w.id}"${String(w.id)===String(wt0)?' selected':''}>${esc(w.name)}${w.proc?'':' (بدون پروسه)'}</option>`).join('')}</select></label>
      <label class="f full">پروسه (مراحل)<select id="l2proc"><option value="">— پروسه‌ی خود نوع کار —</option>${P.map(p=>`<option value="${p.id}">${esc(p.name)} (${fa(p.steps.length)} مرحله)</option>`).join('')}</select></label></div>
    <div class="fields"><label class="f">طراح (اختیاری)<select id="l2des"><option value="">—</option>${S.filter(s=>s.designer).concat(S.filter(s=>!s.designer)).map(s=>`<option value="${esc(s.id)}"${d.designer&&d.designer.id===s.id?' selected':''}>${esc(s.name)}${s.designer?' · طراح':''}</option>`).join('')}</select></label>
      <label class="f">شماره‌ی جعبه<input id="l2box" inputmode="numeric" value="${esc(d.box||'')}"></label>
      <label class="f full">یادداشت (اختیاری)<input id="l2note"></label><label class="chk"><input type="checkbox" id="l2prio"${d.prio==='urgent'?' checked':''}> فوری</label></div>
    <div class="note" id="l2StP"></div><div class="msg" id="l2StM"></div>
    <div class="btns"><button class="btn" type="button" id="l2StOk">شروع</button><button class="btn ghost" type="button" id="l2StNo">انصراف</button></div>`);
  sh.style.zIndex=65;sh.hidden=false;let from=redo&&firstD?firstD.idx:-1;
  const prev=()=>{const w=D.wts.find(v=>String(v.id)===$('l2wt').value),p=D.procs.find(v=>String(v.id)===($('l2proc').value||String(w&&w.proc||'')));$('l2StP').textContent=from>=0?'مراحل '+fa(from+1)+' به بعد دوباره باز می‌شوند؛ مراحل قبلی می‌مانند.':p?'مراحل: '+p.steps.map(s=>(D.depts.find(z=>z.id===s.d)||{}).name||'؟').join(' ← '):'برای این نوع کار پروسه تعریف نشده؛ پروسه را انتخاب کنید.'};
  $('l2wt').onchange=prev;$('l2proc').onchange=prev;prev();
  if($('l2From'))$('l2From').onclick=e=>{const b=e.target.closest('[data-from]');if(!b)return;from=Number(b.dataset.from);$('l2From').querySelectorAll('[data-from]').forEach(c=>c.setAttribute('aria-pressed',c===b));$('l2StF').hidden=from>=0;prev()};
  $('l2StNo').onclick=()=>sh.hidden=true;
  $('l2StOk').onclick=async()=>{const B=$('l2StOk');B.disabled=true;try{const wt=$('l2wt').value;await api('labStart',{lid,wt,proc:$('l2proc').value,from:from>=0?from:'',designer:$('l2des').value,box:toEn($('l2box').value.trim()),note:$('l2note').value.trim(),prio:$('l2prio').checked?'urgent':''});
      try{if(wt)localStorage.setItem(key,wt)}catch(e){}sh.hidden=true;toast('کار شروع شد؛ مراحل در میز کار دپارتمان‌ها آمد.');await pollLab(true);if(L2.ord&&L2.ord.order)l2Load(lid,true)}catch(e){$('l2StM').className='msg err';$('l2StM').textContent=e.message}finally{B.disabled=false}}}
async function l2StepAct(b){const lid=b.dataset.lid,sid=b.dataset.sid,op=b.dataset.l2step;const x=LB.items.find(i=>i.id===lid)||(L2.ord&&L2.ord.order&&Object.assign({},L2.ord.order,{steps:L2.ord.steps}));const s=x&&(x.steps||[]).find(v=>v.id===sid);if(!s)return;
  const p={lid,sid,op};
  if(op==='done'){const r=await l2Ask('تکمیل «'+s.dname+'» — #'+l2No(x.no),[{k:'text',l:'یادداشت (اختیاری)',type:'textarea',full:1}],'تکمیل');if(!r)return;p.text=r.text}
  if(op==='note'){const r=await l2Ask('یادداشت مرحله‌ی «'+s.dname+'»',[{k:'text',l:'یادداشت',type:'textarea',full:1,req:1,v:s.note||''}]);if(!r)return;p.text=r.text}
  if(op==='reopen'){const r=await l2Ask('برگشت به مرحله‌ی «'+s.dname+'»',[{type:'html',html:'<p class="note full">این مرحله و همه‌ی مراحل بعد از آن دوباره باز می‌شوند و برگشت به نام طراح و کارمند مرحله ثبت می‌شود.</p>'},{k:'text',l:'دلیل برگشت',type:'textarea',full:1,req:1}],'برگشت');if(!r)return;p.text=r.text}
  if(op==='skip'){const r=await l2Ask('رد شدن از «'+s.dname+'»',[{k:'text',l:'دلیل (اختیاری)',type:'textarea',full:1}],'رد شدن');if(!r)return;p.text=r.text}
  if(op==='assign'){const D=await l2Defs(),st=D.staff.filter(u=>u.active&&(u.depts||[]).map(Number).includes(Number(s.dept))),other=D.staff.filter(u=>u.active&&!st.includes(u));
    const r=await l2Ask('ارجاع «'+s.dname+'» به شخص مشخص',[{k:'uid',l:'کارمند',type:'select',full:1,v:s.asg||'',opts:[['','— بدون ارجاع (همه‌ی دپارتمان) —']].concat(st.map(u=>[u.id,u.name+' · همین دپارتمان']),other.map(u=>[u.id,u.name]))}],'ثبت');if(!r)return;p.uid=r.uid}
  b.disabled=true;try{const j=await api('labStep',p);toast(op==='accept'?'پذیرش شد.':(op==='done'||op==='quick')?(j.all?'همه‌ی مراحل انجام شد؛ آماده‌ی ارسال.':'تکمیل شد.'):'ثبت شد.');await pollLab(true);if(L2.ord&&L2.ord.order&&L2.ord.order.id===lid)l2Load(lid,true)}
  catch(e){if(/فایل/.test(e.message)&&(op==='done'||op==='quick')){toast(e.message,1);if(!(L2.ord&&L2.ord.order&&L2.ord.order.id===lid))l2Open(lid)}else alertMsg(e.message),toast(e.message,1)}finally{b.disabled=false}}
async function l2Send(lid,b){const x=LB.items.find(i=>i.id===lid);const r=await l2Ask('ارسال به کلینیک — '+(x?x.name:''),[{k:'note',l:'یادداشت برای کلینیک (اختیاری)',type:'textarea',full:1}],'ارسال شد');if(!r)return;
  if(b)b.disabled=true;try{await api('labSet',{lid,st:'ready',note:r.note||'',by:USERNAME||'لابراتوار'});toast('ارسال شد؛ کلینیک باخبر شد.');await pollLab(true);if(L2.ord&&L2.ord.order&&L2.ord.order.id===lid)l2Load(lid,true)}catch(e){alertMsg(e.message);toast(e.message,1)}finally{if(b)b.disabled=false}}

