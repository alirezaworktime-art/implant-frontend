/* ---------- patient link ---------- */
let PL=null;
function snapFor(r){const pv=PV(r,1),T=totals(pv),b=effBrand(r),bn=needBrand(r)?(BRANDS.find(x=>x.k===b)||{}).n:'';let pt={};try{pt=payText(pv,b)}catch(e){}
  return {lines:secLines(r.s).map(l=>({t:l.t,d:l.d})),total:T.surg[b]+T.pros,surg:T.surg[b],pros:T.pros,brand:bn,pay:pt,doc:r.h.doc||''}}
const linkUrl=tok=>(CF_URL||(location.origin+'/'))+'p#'+tok;
async function openLink(renew){if(!PF)return;const m=$('plMsg');$('plSheet').hidden=false;m.className='msg';m.textContent='در حال ساخت لینک…';$('pl_url').value='';
  try{const r=fromDoc(PF.id,PF.j.data||{});const j=await api('patLink',{id:PF.id,snap:snapFor(r),renew:!!renew});PL={tok:j.tok,phone:r.h.phone||'',name:r.h.name||''};const u=linkUrl(j.tok);$('pl_url').value=u;
    const txt=`${PL.name?PL.name+' عزیز':'بیمار عزیز'}، سلام. پرونده‌ی درمان شما در ${SET.clinic||'کلینیک'} (طرح درمان، نوبت‌ها و پرداخت‌ها) از این لینک قابل مشاهده است:\n${u}`;
    const w=waLink(PL.phone,txt),s=smsLink(PL.phone,txt);$('plWa').href=w||('https://wa.me/?text='+encodeURIComponent(txt));$('plSms').href=s||('sms:?body='+encodeURIComponent(txt));
    m.className='msg ok';m.textContent=renew?'لینک تازه ساخته شد؛ لینک قبلی دیگر کار نمی‌کند.':'لینک آماده است.';PF.j.link=true}
  catch(e){m.className='msg err';m.textContent=e.message}}

