
/* ---------- m59a (owner, 2026-11-20): the lab order form of the doctor = «طرح ۱ — یک نگاه»: what is known about the patient on top (from the file),
   three questions (ساخت برای، نوع روکش، رنگ) + the base / pontic chart, all filled from the history; the full sheet stays under «جزئیات بیشتر».
   No field is mandatory for any doctor order (m58b's free order for every doctor order). ---------- */
const M59K={zs:['زیرکونیا پیچ‌شونده',['Implant (zirconia)','پیچ شونده'],['مونولیتیک']],zc:['زیرکونیا سمانی',['Implant (zirconia)','سمان شونده'],['مونولیتیک']],
  pfm:['PFM سمانی',['Implant (PFM)','سمان شونده'],['پرسلن']],sc:['اسکروسمنت',['Implant (zirconia)','اسکروسمنت'],['مونولیتیک']]};
const M59={more:false,lo:null};
const m59Doc=()=>!!ROLE&&['surgery','doctor'].includes(ROLE);
const m59Same=(a,b)=>JSON.stringify((a||[]).slice().sort())===JSON.stringify((b||[]).slice().sort());
function m59Kind(H){for(const k in M59K){if(m59Same(H.itype,M59K[k][1])&&m59Same(H.imat,M59K[k][2]))return k}return ''}
/* history → the sheet (only empty fields) */
function m59Fill(j,H){try{const h=(fromDoc(PF.id,j.data||{}).h)||{},pr=j.pros||{},im=pr.imp||{};
  const L=(j.labs||[]).filter(l=>l&&l.st!=='cancel').slice().sort((a,b)=>String(b.created||'').localeCompare(String(a.created||''))),last=(L[0]&&L[0].data)||{};
  if(!String(H.file||'').trim()&&h.file)H.file=String(h.file);
  if(!String(H.age||'').trim()&&h.age)H.age=String(h.age);
  if(!String(H.shade||'').trim()){const s=LO.shade||im.shade||last.shade||'';if(s){H.shade=s;LO.shade=s}}
  if(!(H.itype||[]).length&&!(H.imat||[]).length){if((last.ctype||[]).length||(last.cmat||[]).length){H.itype=(last.ctype||[]).slice();H.imat=(last.cmat||[]).slice()}}
  if(!(H.imp||[]).length&&(last.implant||[]).length)H.imp=last.implant.slice(0,1);
  if(!String(H.asst||'').trim()&&last.asst)H.asst=last.asst;
  if(!LO.meth&&im.meth)LO.meth=im.meth;
  if(!LO.for){const t=pr2T(pr),F=pr2LabFor(t),st0=pr.stage||'impr';let fr=pr.after&&F.includes(pr.after)?pr.after:'';
    if(!fr){const n=pr2Next(t,PR2.TEST.includes(st0)||st0==='impr'||st0==='lab'?(st0==='lab'?'impr':st0):'impr');fr=n&&n.st==='lab'&&F.includes(n.for)?n.for:(F.includes(LFOR_DEF[st0])?LFOR_DEF[st0]:F[0])}
    if(fr&&LFOR[fr])LO.for=fr}}catch(e){console.error('m59 fill',e)}}
(function(){const _i=h9Init;h9Init=function(j){const fresh=!!LO&&!LO.h9;const H=_i.apply(this,arguments);if(fresh&&H&&m59Doc())m59Fill(j,H);return H}})();
function m59Tooth(k,i){const H=LO.h9,c=(H.base||[]).includes(k)?'a':(H.pon||[]).includes(k)?'p':'';return `<button type="button" class="m59t ${c}" data-m59t="${k}">${fa(i)}</button>`}
function m59Chart(){const row=j=>{let r='';for(let i=8;i>=1;i--)r+=m59Tooth(j+'R'+i,i);r+='<span class="m59md"></span>';for(let i=1;i<=8;i++)r+=m59Tooth(j+'L'+i,i);return `<div class="m59jw">${r}</div>`};
  return `<div class="m59ch" dir="ltr">${row('U')}${row('L')}</div><div class="m59lg"><i class="a"></i>پایه <i class="p"></i>پونتیک — یک بار = پایه، دو بار = پونتیک، سه بار = برداشتن</div>`}
function m59Block(j){const H=LO.h9,h=(fromDoc(PF.id,j.data||{}).h)||{},imp=implantsOf(j),T=Object.keys(imp).filter(isTooth),kd=m59Kind(H),sh=String(H.shade||'').trim();
  const A=t=>`<span class="m59a">${t}</span>`,F=(l,v,a)=>!v?'':`<div class="m59f"><small>${l}</small><b>${esc(v||'—')}</b>${v&&a?A(a):''}</div>`;
  const due=LO.due?jDay(LO.due):'',meth=(PR2.METH||{})[LO.meth]||'';
  return `<div class="m59">
    <div class="m59hd"><b>${esc(H.name||h.name||'')}</b><span>${[H.file?'پرونده‌ی '+faD(H.file):'',H.age?faD(H.age)+' ساله':''].filter(Boolean).join(' · ')}</span>${A('از پرونده')}</div>
    <div class="m59fs">${F('پزشک',H.doc,'ورود')}${F('دستیار',H.asst,'جراحی')}${F('برند ایمپلنت',H.brand,'جراحی')}${F('ایمپلنت‌ها',T.length?toothTxt(T):'','جراحی')}${F('روش قالب‌گیری',meth,'پرونده')}${F('تحویل',due?due+(LO.dueTxt?'':' (۱۰ روز)'):'۱۰ روز بعد','خودکار')}</div>
    <div class="m59q"><span>ساخت برای ${LO.for?A('مرحله‌ی بعد'):''}</span><div class="chips">${Object.keys(LFOR).map(k=>`<button type="button" class="chip" data-lofor="${k}" aria-pressed="${LO.for===k}">${LFOR[k]}</button>`).join('')}</div></div>
    <div class="m59q"><span>نوع روکش ${kd?A('سفارش قبلی'):''}</span><div class="chips">${Object.keys(M59K).map(k=>`<button type="button" class="chip" data-m59k="${k}" aria-pressed="${kd===k}">${M59K[k][0]}</button>`).join('')}</div></div>
    <div class="m59q"><span>رنگ ${sh?A('پرونده'):''}</span><div class="chips">${(PR2.SHADES||['A1','A2','A3','B1','B2']).map(v=>`<button type="button" class="chip" data-m59s="${esc(v)}" aria-pressed="${sh===v}">${esc(v)}</button>`).join('')}<button type="button" class="chip" data-m59s="" aria-pressed="${!sh}">بعداً</button></div></div>
    <div class="m59q"><span>دندان‌ها ${(H.base||[]).length?A('پایه / پونتیک پرونده'):''}</span>${m59Chart()}</div>
    <button type="button" class="m59more" data-m59more="1">${M59.more?'− بستن جزئیات':'+ جزئیات بیشتر (برگه‌ی کامل: روکش دندانی، ایمپلنت، عکس دهانی، تاریخ، روش، نوشتن با قلم)'}</button></div>`}
(function(){const _f=loForm;loForm=function(j){const h=_f.apply(this,arguments);try{if(!m59Doc()||!LO||!PF||!h.includes('<div class="payform h9form">'))return h;
  if(M59.lo!==LO){M59.lo=LO;M59.more=false}if(!LO.h9)h9Init(j);
  return h.replace('<div class="payform h9form">','<div class="payform h9form m59x'+(M59.more?'':' m59c')+'">'+m59Block(j))}catch(e){console.error('m59 form',e);return h}}})();
/* every doctor order is free (m58b) */
(function(){const _s=loSend;loSend=async function(t){if(m59Doc()&&LO&&PF){M58L=PF.id;try{h9Read();h9Apply();if((LO.h9&&LO.h9.base||[]).length)await h9Map()}catch(e){}return m58Send(t)}return _s.apply(this,arguments)}})();
(function(){const _f=loForm;loForm=function(j){const h=_f.apply(this,arguments);if(!m59Doc()||!PF||h.includes('m58o'))return h;
  return h.replace('<div class="msg" id="loMsg"></div>','<p class="note m58o">هیچ فیلدی اجباری نیست؛ هرچه لازم است پر کنید. تاریخ خالی = ۱۰ روز بعد؛ دندان‌ها خالی = پایه و پونتیک پرونده.</p><div class="msg" id="loMsg"></div>')}})();
function m59Redraw(){try{h9Read()}catch(e){}try{h9Apply()}catch(e){}const sc=document.querySelector('#pfSheet .in'),y=sc?sc.scrollTop:0;renderFile();if(sc)sc.scrollTop=y}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-m59k],[data-m59s],[data-m59t],[data-m59more]');if(!t||!LO||!LO.h9)return;e.preventDefault();const H=LO.h9,d=t.dataset;
  if(d.m59k!==undefined){const k=d.m59k;if(m59Kind(H)===k){H.itype=[];H.imat=[]}else{H.itype=M59K[k][1].slice();H.imat=M59K[k][2].slice()}}
  else if(d.m59s!==undefined){try{h9Read()}catch(x){}H.shade=d.m59s;LO.shade=d.m59s;const i=document.querySelector('[data-h9f="shade"]');if(i)i.value=d.m59s}
  else if(d.m59t){try{h9Read()}catch(x){}const k=d.m59t,a=(H.base||[]).includes(k),p=(H.pon||[]).includes(k);H.base=(H.base||[]).filter(x=>x!==k);H.pon=(H.pon||[]).filter(x=>x!==k);if(!a&&!p)H.base.push(k);else if(a)H.pon.push(k)}
  else if(d.m59more){M59.more=!M59.more}
  m59Redraw()});
