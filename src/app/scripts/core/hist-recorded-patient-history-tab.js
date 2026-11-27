/* ---------- hist: recorded patient history tab ---------- */
const EV_CATL={all:'همه',plan:'طرح و پذیرش',fin:'مالی',appt:'نوبت و پیگیری',surg:'جراحی',pros:'پروتز و لابراتوار',file:'فایل و لینک'};
let EVF='all';const evFa=t=>esc(String(t||'').replace(/\d{4}-\d{2}-\d{2}/g,m=>{try{return jDay(m)||m}catch(e){return m}}));
function pfHist(j){const E=(PF&&PF.ev)||null;if(!E)return '<div class="empty">در حال بارگذاری تاریخچه…</div>';
  const L=E.filter(e=>EVF==='all'||e.cat===EVF);
  const chips=Object.keys(EV_CATL).map(k=>`<button type="button" class="chip" data-evf="${k}" aria-pressed="${EVF===k}">${EV_CATL[k]}${k!=='all'?' <small>'+fa(E.filter(e=>e.cat===k).length)+'</small>':''}</button>`).join('');
  let day='';const rows=L.map(e=>{const d=jd(e.at),hd=d!==day?`<div class="evday">${esc(d)}</div>`:'';day=d;
    return hd+`<div class="evrow${e.undone?' undone':''}"><span class="evt">${esc(tmF(e.at))}</span><div class="evb"><div class="evtitle">${evFa(e.title)}${e.undone?' <span class="pill settle">برگردانده شد</span>':''}</div>${e.detail?`<div class="evdet">${evFa(e.detail)}</div>`:''}<div class="evwho">${esc(e.who||'')}</div></div>${e.canUndo?`<button class="btn sm ghost" type="button" data-evundo="${esc(e.id)}">برگرداندن</button>`:''}</div>`}).join('');
  return `<div class="chips evchips">${chips}</div><div class="evlist">${rows||'<div class="empty">هنوز رویدادی ثبت نشده.</div>'}</div>`}
function pfHistLoad(){if(!PF)return;const id=PF.id;api('events',{id}).then(j=>{if(PF&&PF.id===id){PF.ev=j.items||[];if(PF.tab==='hist'){renderFile();return}const n=$('pfEvN');if(n)n.textContent=fa(PF.ev.length);
  const e0=PF.ev[0],tb=document.querySelector('#pfBody .pftabs');if(e0&&tb&&!document.querySelector('#pfBody .evlast')){const d=document.createElement('div');d.className='evlast';d.textContent=`آخرین تغییر: ${String(e0.title).replace(/\d{4}-\d{2}-\d{2}/g,m=>{try{return jDay(m)||m}catch(x){return m}})} · ${jt(e0.at)}${e0.who?' · '+e0.who:''}`;tb.before(d)}}}).catch(()=>{if(PF&&PF.id===id){PF.ev=[];if(PF.tab==='hist')renderFile()}})}
document.addEventListener('click',async e=>{const c=e.target.closest&&e.target.closest('[data-evf]');if(c){EVF=c.dataset.evf;renderFile();return}
  const t=e.target.closest&&e.target.closest('button[data-evundo]');if(!t)return;if(!arm2(t,'برگردانده شود؟ دوباره بزنید'))return;t.disabled=true;
  try{const j=await api('evUndo',{eid:t.dataset.evundo,by:($('rc_asst')||{}).value||ROLE_LBL[ROLE]||''});toast('برگردانده شد: '+(j.title||''));PF.ev=null;refreshFile();pfHistLoad();pollQ(true)}catch(err){toast(err.message,1);t.disabled=false}},true);

