/* ---------- overview strip ---------- */
function renderKpi(){const el=ROLE==='staff'?$('kpiStripR'):$('kpiStrip');if(!el)return;if(ROLE==='staff'){el.hidden=true;return}const K=[];const td=tDay();
  if(ROLE==='staff'){K.push(['پذیرش امروز',QITEMS.filter(x=>x.queue!=='surgery'&&(x.queuedAt||'').slice(0,10)===new Date().toISOString().slice(0,10)).length]);K.push(['در جراحی',QITEMS.filter(x=>x.queue==='surgery').length]);
    K.push(['پیگیری امروز',TASKS.filter(t=>!t.done&&t.kind!=='uncover'&&dDiff(t.due,td)<=0).length,'warn']);K.push(['آنکاوری ۱۴ روز',TASKS.filter(t=>!t.done&&t.kind==='uncover'&&dDiff(t.due,td)<=14).length]);if(CF_ON)K.push(['نوبت امروز',QAPPT.filter(a=>a.day===td&&a.st!=='cancel').length])}
  else if(ROLE==='doctor'){K.push(['منتظر پزشک',QITEMS.filter(x=>x.queue==='waiting'||x.queue==='reviewing').length,'warn']);K.push(['منتظر مشاور',QITEMS.filter(x=>x.queue==='consult'||x.queue==='consulting').length]);K.push(['در جراحی',QITEMS.filter(x=>x.queue==='surgery').length])}
  else if(ROLE==='consultant'){K.push(['منتظر مشاور',QITEMS.filter(x=>x.queue==='consult').length,'warn']);K.push(['نزد مشاور',QITEMS.filter(x=>x.queue==='consulting').length]);if(CF_ON){K.push(['چک سررسید',QCHQ.length,'warn']);K.push(['پیگیری طرح امروز',TASKS.filter(t=>!t.done&&(t.kind==='fol1'||t.kind==='fol4')&&dDiff(t.due,td)<=0).length,'warn'])}
    if(INV.loaded){const low=INV.items.filter(i=>['low','out','neg'].includes(invState(i))&&(Number(i.min)||Number(i.qty)<0)).length;K.push(['کم‌موجودی انبار',low,low?'warn':''])}}
  else if(ROLE==='surgery'){K.push(['امروز در جراحی',QITEMS.filter(x=>x.queue==='surgery').length,'warn']);if(CF_ON)K.push(['نوبت جراحی امروز',QAPPT.filter(a=>SG_K.includes(a.kind)).length]);if(CF_ON)K.push(['چکاپ و انکاوری امروز',QAPPT.filter(a=>CK_K.includes(a.kind)||a.kind==='uncover').length])}
  el.hidden=!K.length;el.innerHTML=K.map(([l,n,c])=>`<div class="kpi mini${c&&n?' '+c:''}"><b>${fa(n)}</b><span>${l}</span></div>`).join('')}

