/* ---------- m43c (owner, 2026-11-17): manager cartable — tile «تعرفه و سهم پزشکان»: (1) patient tariff of every accounting service, (2) doctor share of
   every service for all doctors as «مبلغ» or «درصد», (3) exceptions for one doctor; implant surgery has a row per brand. First week: a change is also
   applied to the earlier automatic invoices. ---------- */
(function(){
const M={d:null,tab:'share',who:'',busy:false};
const CAT={s:'جراحی',p:'پروتز',o:'سایر'};
try{['هزینه جراحی ایرانی','هزینه جراحی رووت'].forEach(n=>{if(typeof M14_MAP!=='undefined'&&!M14_MAP.includes(n))M14_MAP.push(n)})}catch(e){}
try{const _t=TILES.manager;TILES.manager=()=>{const L=_t(),i=L.findIndex(x=>x.k==='dr'),t={k:'m43',c:'cons',l:'تعرفه و سهم پزشکان',s:'تعرفه‌ی بیمار · سهم پزشک هر خدمت',n:0,act:1,tab:'m43Open'};if(i>=0)L.splice(i+1,0,t);else L.push(t);return L}}catch(e){console.error('m43c tile',e)}
(function(){const b=document.createElement('button');b.type='button';b.id='m43Open';b.hidden=true;document.body.appendChild(b)})();
const fromSet=n=>{try{return typeof m14Map==='function'&&m14Map(n)}catch(e){return false}};
const rule=(svc,payee)=>(M.d.shares||[]).find(r=>r.svc===svc&&r.payee===payee)||null;
const feeOf=(svc,payee)=>{const f=(M.d.fees||[]).find(x=>x.svc===svc&&x.payee===payee);return f?Number(f.amount)||0:0};
const amtOf=(r,price)=>r?(r.mode==='p'?Math.round((Number(price)||0)*(Number(r.val)||0)/100):Math.round(Number(r.val)||0)):0;
const docs=()=>(M.d.payees||[]).filter(p=>p.active!==0&&p.kind==='doctor');
const svcs=()=>(M.d.svc||[]).filter(s=>s.active!==0);
const grp=()=>{const B=M.d.brandSvc||[],S=svcs(),isB=s=>B.some(n=>normN(n)===normN(s.name));return [['جراحی ایمپلنت به تفکیک برند',S.filter(isB).sort((a,b)=>B.findIndex(n=>normN(n)===normN(a.name))-B.findIndex(n=>normN(n)===normN(b.name)))]].concat(['s','p','o'].map(c=>[CAT[c],S.filter(s=>!isB(s)&&(s.cat||'o')===c)])).filter(g=>g[1].length)};
function sheet(){return mkSheet('m43Sh','<div id="m43Body"></div>')}
function tabs(){return `<div class="seg" role="group" aria-label="بخش" style="margin:10px 0"><button type="button" data-m43t="price" aria-pressed="${M.tab==='price'}">تعرفه‌ی بیمار</button><button type="button" data-m43t="share" aria-pressed="${M.tab==='share'}">سهم پزشک — همه‌ی پزشکان</button><button type="button" data-m43t="exc" aria-pressed="${M.tab==='exc'}">استثنا برای یک پزشک</button></div>`}
function rowShare(s,payee){const r=rule(s.id,payee),def=payee==='*'?null:rule(s.id,'*'),clinic=s.rule==='clinic';
  if(clinic)return `<tr><td>${esc(s.name)}</td><td class="num">${Number(s.price)?fa(Number(s.price)):'—'}</td><td colspan="3"><small class="note">خدمت کلینیک؛ سهم پزشک ندارد</small></td></tr>`;
  const hint=payee==='*'?(r?'':'<small class="note">بدون قاعده؛ مبلغ قبلی هر پزشک می‌ماند</small>'):(r?'':def?`<small class="note">طبق همه: ${def.mode==='p'?fa(def.val)+'٪':fa(def.val)} = ${fa(amtOf(def,s.price))}</small>`:`<small class="note">الان: ${fa(feeOf(s.id,payee))}</small>`);
  const out=r?fa(amtOf(r,s.price)):(payee==='*'?'—':fa(feeOf(s.id,payee)));
  return `<tr data-m43row="${esc(s.id)}"><td>${esc(s.name)}</td><td class="num">${Number(s.price)?fa(Number(s.price)):'<b class="late">تعرفه ندارد</b>'}</td>
    <td><select data-m43m aria-label="نوع سهم ${esc(s.name)}"><option value="">${payee==='*'?'—':'طبق همه'}</option><option value="a"${r&&r.mode==='a'?' selected':''}>مبلغ (تومان)</option><option value="p"${r&&r.mode==='p'?' selected':''}>درصد</option></select></td>
    <td><input data-m43v inputmode="decimal" class="ltr" value="${r?(r.mode==='p'?String(r.val):fa(r.val)):''}" aria-label="مقدار سهم ${esc(s.name)}"></td><td class="num"><b data-m43o>${out}</b>${hint?'<span data-m43h><br>'+hint+'</span>':''}</td></tr>`}
function draw(){const b=$('m43Body');if(!b)return;if(!M.d){b.innerHTML='<h3>تعرفه و سهم پزشکان</h3><p class="note">در حال خواندن…</p>';return}
  const D=docs();if(M.who&&!D.some(p=>p.id===M.who))M.who='';const G=grp();let body='';
  if(M.tab==='price')body=`<p class="note">تعرفه‌ای که از بیمار گرفته می‌شود. ردیف‌هایی که «از تنظیمات» دارند از تعرفه‌های فرم طرح درمان (کاشی «تنظیمات») می‌آیند و همان‌جا عوض می‌شوند؛ جراحی ایمپلنت برای هر برند ردیف خودش را دارد.</p>
    <div class="m43tw"><table><thead><tr><th>خدمت</th><th>تعرفه‌ی بیمار (تومان)</th></tr></thead><tbody>${G.map(([t,L])=>`<tr class="m43cat"><td colspan="2">${esc(t)}</td></tr>`+L.map(s=>`<tr><td>${esc(s.name)}</td><td>${fromSet(s.name)?`<input class="price" disabled value="${Number(s.price)?fa(Number(s.price)):''}"><small class="note">از تنظیمات</small>`:`<input class="price ltr" inputmode="numeric" data-m43p="${esc(s.id)}" value="${Number(s.price)?fa(Number(s.price)):''}" aria-label="تعرفه‌ی ${esc(s.name)}">`}</td></tr>`).join('')).join('')}</tbody></table></div>`;
  else{const payee=M.tab==='exc'?M.who:'*';
    body=(M.tab==='exc'?`<p class="note">فقط برای پزشکی که سهمش با بقیه فرق دارد. خانه‌ی خالی یعنی «طبق همه».</p><div class="chips" style="margin:6px 0">${D.map(p=>`<button type="button" class="chip" data-m43who="${esc(p.id)}" aria-pressed="${p.id===M.who}">${esc(p.name)}${(M.d.shares||[]).some(r=>r.payee===p.id)?' •':''}</button>`).join('')}</div>`
        :`<p class="note">سهم پزشک از هر خدمت، برای همه‌ی پزشکان. «مبلغ» = تومان برای هر واحد؛ «درصد» = درصدی از تعرفه‌ی بیمارِ همان خدمت (با عوض شدن تعرفه، سهم هم عوض می‌شود). ردیف بدون قاعده، مبلغ قبلی هر پزشک را نگه می‌دارد.</p>`)+
      (payee?`<div class="m43tw"><table><thead><tr><th>خدمت</th><th>تعرفه‌ی بیمار</th><th>نوع سهم</th><th>مقدار</th><th>سهم هر واحد (تومان)</th></tr></thead><tbody>${G.map(([t,L])=>`<tr class="m43cat"><td colspan="5">${esc(t)}</td></tr>`+L.map(s=>rowShare(s,payee)).join('')).join('')}</tbody></table></div>`:'<div class="empty">یک پزشک را انتخاب کنید.</div>')}
  const wk=Number(M.d.weekLeft)||0;
  b.innerHTML=`<h3>تعرفه و سهم پزشکان</h3>${tabs()}${body}<div class="msg" id="m43Msg" role="alert"></div>
    <p class="note" id="m43Wk">${wk?`هفته‌ی اول راه‌اندازی (${fa(wk)} روز مانده): هر تغییر روی صورتحساب‌های خودکار قبلی هم اعمال می‌شود (${fa(M.d.autoInv||0)} صورتحساب).`:'تغییرها فقط روی کارهای تازه اثر می‌کند. برای اعمال روی صورتحساب‌های خودکار قبلی دکمه‌ی زیر را بزنید.'}</p>
    <div class="btns"><button type="button" class="btn" id="m43Save">ذخیره</button>${wk?'':'<button type="button" class="btn ghost" id="m43Apply">اعمال روی صورتحساب‌های خودکار قبلی</button>'}<button type="button" class="btn ghost" id="m43Close">بستن</button></div>`}
const msg=(t,k)=>{const m=$('m43Msg');if(m){m.className='msg '+(k||'');m.textContent=t}};
async function load(){const s=sheet();s.hidden=false;M.d=null;draw();try{M.d=await api('m43Get',{});draw()}catch(e){const b=$('m43Body');if(b)b.innerHTML=`<h3>تعرفه و سهم پزشکان</h3><p class="msg err">${esc(e.message)}</p><div class="btns"><button type="button" class="btn ghost" id="m43Close">بستن</button></div>`}}
function live(tr){try{const s=svcs().find(x=>x.id===tr.dataset.m43row),m=tr.querySelector('[data-m43m]').value,v=Number(toEn(tr.querySelector('[data-m43v]').value).replace(/[^\d.]/g,''))||0,o=tr.querySelector('[data-m43o]');const hn=tr.querySelector('[data-m43h]');if(hn)hn.hidden=!!m;if(s&&o&&m)o.textContent=fa(amtOf({mode:m,val:v},s.price))}catch(e){}}
async function apply(){let after='',done=0,skip=0;for(let i=0;i<400;i++){msg(`در حال اعمال روی صورتحساب‌های قبلی… ${fa(done)} انجام شد`,'');const r=await api('m43Apply',{after},{timeout:60000});done+=r.done||0;skip+=r.skip||0;if(!r.next)break;after=r.next}return {done,skip}}
async function save(){if(M.busy)return;M.busy=true;const bt=$('m43Save');if(bt)bt.disabled=true;try{let n=0,ch=false;
  if(M.tab==='price'){for(const i of document.querySelectorAll('#m43Body [data-m43p]')){const s=M.d.svc.find(x=>x.id===i.dataset.m43p),v=num(i.value);if(s&&v!==(Number(s.price)||0)){await api('m14Save',{t:'svc',x:Object.assign({},s,{price:v,active:s.active!==0})});n++;ch=true}}if(n)M.d=await api('m43Get',{})}
  else{const payee=M.tab==='exc'?M.who:'*',rows=[];if(!payee){msg('یک پزشک را انتخاب کنید.','err');return}
    for(const tr of document.querySelectorAll('#m43Body [data-m43row]')){const svc=tr.dataset.m43row,m=tr.querySelector('[data-m43m]').value,raw=toEn(tr.querySelector('[data-m43v]').value).replace(/[^\d.]/g,''),r=rule(svc,payee);
      if(!m||raw===''){if(m&&raw===''){msg('برای ردیفی که «مبلغ» یا «درصد» دارد مقدار را بنویسید.','err');tr.querySelector('[data-m43v]').focus();return}if(r)rows.push({svc,payee,mode:'',val:''});continue}
      const v=Number(raw);if(m==='p'&&v>100){msg('درصد نمی‌تواند بیشتر از ۱۰۰ باشد.','err');tr.querySelector('[data-m43v]').focus();return}
      if(!r||r.mode!==m||Number(r.val)!==v)rows.push({svc,payee,mode:m,val:v})}
    if(rows.length){M.d=await api('m43Save',{rows});n=rows.length;ch=true}}
  draw();if(!ch){msg('تغییری نبود.','ok');return}
  if(Number(M.d.weekLeft)>0&&Number(M.d.autoInv)>0){const r=await apply();M.d=await api('m43Get',{});draw();msg(`${fa(n)} مورد ذخیره شد و روی ${fa(r.done)} صورتحساب خودکار قبلی اعمال شد${r.skip?' ('+fa(r.skip)+' مورد دست نخورد: روز بسته یا صورتحساب دستی)':''}.`,'ok')}
  else msg(`${fa(n)} مورد ذخیره شد؛ حسابداری و گزارش سهم پزشکان از همین استفاده می‌کنند.`,'ok')}
  catch(e){msg(e.message,'err')}finally{M.busy=false;const b2=$('m43Save');if(b2)b2.disabled=false}}
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('button');if(!t)return;
  if(t.id==='m43Open'){if(ROLE==='manager')load();return}
  if(!t.closest('#m43Sh'))return;
  if(t.dataset.m43t){M.tab=t.dataset.m43t;draw();return}
  if(t.dataset.m43who!==undefined){M.who=M.who===t.dataset.m43who?'':t.dataset.m43who;draw();return}
  if(t.id==='m43Close'){$('m43Sh').hidden=true;return}
  if(t.id==='m43Save'){save();return}
  if(t.id==='m43Apply'){if(M.busy)return;const y=await uxAsk({title:'اعمال روی صورتحساب‌های قبلی',msg:`${fa(M.d.autoInv||0)} صورتحساب خودکار با تعرفه و سهم امروز دوباره ساخته می‌شود. صورتحساب‌های دستی و روزهای بسته‌شده دست نمی‌خورند. ادامه بدهم؟`,ok:'اعمال کن'});if(!y)return;M.busy=true;t.disabled=true;try{const r=await apply();M.d=await api('m43Get',{});draw();msg(`روی ${fa(r.done)} صورتحساب اعمال شد${r.skip?' ('+fa(r.skip)+' مورد دست نخورد)':''}.`,'ok')}catch(er){msg(er.message,'err')}finally{M.busy=false}return}});
document.addEventListener('input',e=>{const tr=e.target.closest&&e.target.closest('#m43Body [data-m43row]');if(tr)live(tr)});
document.addEventListener('change',e=>{const tr=e.target.closest&&e.target.closest('#m43Body [data-m43row]');if(tr)live(tr)});
try{if(typeof ACT_L==='object')Object.assign(ACT_L,{m43Save:'تعرفه و سهم پزشکان'})}catch(e){}
window.m43c={load,state:()=>M};
})();
