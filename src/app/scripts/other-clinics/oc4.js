/* ---------- oc4: «سایر کلینیک‌ها» روی لینک کند — (۱) جابه‌جایی مربع‌ها داده‌ی تازه (کمتر از ۴۵ ثانیه) را دوباره از سرور نمی‌گیرد؛
   (۲) فهرست بیماران و پرونده‌ی بیمار اول از حافظه نشان داده می‌شوند و در پس‌زمینه تازه می‌شوند؛ (۳) نوار باریک «در حال دریافت» بالای بخش.
   هیچ محاسبه یا ذخیره‌ای عوض نشده؛ هر ثبت همان ocLoad/oc2Open کامل را صدا می‌زند. ---------- */
function ocLoadSoft(){const [f,t]=OC.seg==='rep'||OC.seg==='pay'?ocRange(OC.per):ocRange('m0');
  if(OC.d&&OC.key===f+'|'+t&&OC.at&&Date.now()-OC.at<45000){ocRender();try{renderTiles()}catch(e){}return}
  return ocLoad()}
{ const _l=oc2Load; oc2Load=async function(){const cl=OC2.cl||(ocMine()[0]||{}).id||'';OC2.cl=cl;const key=cl+'|'+(OC2.q||'');OC2.pc=OC2.pc||{};
    if(OC2.pc[key]&&!OC2.pat){OC2.pats=OC2.pc[key];ocRender()}
    try{const j=await api('oc',{op:'pats',clinic:cl,q:OC2.q});OC2.pats=j.pats||[];OC2.pc[key]=OC2.pats}catch(e){OC2.pats=OC2.pc[key]||[]}
    if(!OC2.pat)ocRender()} }
{ const _o=oc2Open; oc2Open=async function(id){OC2.vc=OC2.vc||{};const c=OC2.vc[id];
    if(c){OC2.pat=c.pat;OC2.v=c;OC2.f=null;ocRender();window.scrollTo(0,0)}
    try{const j=await api('oc',{op:'pat',id});if(!j||!j.ok)throw new Error((j&&j.error)||'خطا');OC2.vc[id]=j;if(OC2.pat&&OC2.pat.id!==id&&c)return;OC2.pat=j.pat;OC2.v=j;if(!c)OC2.f=null;ocRender();if(!c)window.scrollTo(0,0)}
    catch(e){if(!c)alertMsg(e.message)}} }
{ const _a=api,N={n:0};api=function(action,payload){const p=_a.apply(this,arguments);if(action!=='oc')return p;
    const r=document.getElementById('ocRoot');if(r){N.n++;r.classList.add('oc-wait')}
    return Promise.resolve(p).finally(()=>{const r2=document.getElementById('ocRoot');if(--N.n<=0){N.n=0;r2&&r2.classList.remove('oc-wait')}})} }
{ const _p=api;api=function(action,payload){const p=_p.apply(this,arguments);
    if(action==='oc'&&payload&&payload.op==='pat'&&OC2.vc)Promise.resolve(p).then(j=>{if(j&&j.ok&&j.pat)OC2.vc[j.pat.id]=j}).catch(()=>{});
    if(action==='oc'&&payload&&payload.op&&/^(ses3|session|pros|prosDel|sesDel|plan3|patNew)$/.test(payload.op)){OC2.pc={};if(OC2.vc)Promise.resolve(p).then(()=>{OC2.vc={}}).catch(()=>{})}
    return p} }
