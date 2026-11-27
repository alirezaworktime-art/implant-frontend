/* ---------- inventory (انبار) ---------- */
const INV={ver:'',items:[],moves:[],usage:[],loaded:false,seg:'fix',low:false,busy:false,cur:null,kind:'fix',mvType:'in'};
const INV_SUG=['پودر استخوان','ممبران','نخ بخیه','تگ','کیت CGF','کارپول بی‌حسی','تیغ بیستوری','سرنگ','گاز استریل','اباتمنت'];
const KLBL={fix:'فیکسچر',heal:'هیلینگ',cover:'کاور',other:'مواد مصرفی'};
const invCanEdit=()=>ROLE==='inventory';
const invNote=t=>esc(t||'').replace(/دندان (UR|UL|LR|LL)(\d)/g,(m,q,n)=>'دندان '+toothTxt([q+n]));
const nk=v=>{const t=toEn(v).trim().replace(/[\/٫,]/g,'.');const f=parseFloat(t);return isFinite(f)&&/^[\d.]+$/.test(t)?String(f):t.toLowerCase().replace(/[×*]/g,'x').replace(/\s/g,'')};
const sysKey=(b,s)=>String(b||'').trim().toLowerCase()+'|'+String(s||'').trim().toLowerCase();
/* settings catalog merged by brand + system (a system may span several rows, e.g. JD Plus Ø6 has an extra 6 mm length); dl = lengths of each diameter */
let CATM_SRC=null,CATM_V=[];
function catM(){const c=SET.catalog||[];if(c===CATM_SRC)return CATM_V;const m=new Map(),srt=a=>a.sort((x,y)=>parseFloat(x)-parseFloat(y)||String(x).localeCompare(y)),put=(a,v)=>{if(!a.includes(v))a.push(v)};
  c.forEach(x=>{const k=sysKey(x.b,x.sys);let o=m.get(k);if(!o){o={g:x.g,b:x.b,sys:x.sys,d:[],l:[],h:[],dl:{}};m.set(k,o)}
    (x.d||[]).forEach(d=>{put(o.d,d);const L=o.dl[d]=o.dl[d]||[];(x.l||[]).forEach(l=>put(L,l))});(x.l||[]).forEach(l=>put(o.l,l));(x.h||[]).forEach(h=>put(o.h,h))});
  CATM_V=[...m.values()].map(o=>{srt(o.d);srt(o.l);Object.values(o.dl).forEach(srt);return o});CATM_SRC=c;return CATM_V}
const catLens=(c,d)=>c?((d&&c.dl[d])||c.l):null;
function invState(i){const q=Number(i.qty)||0,mn=Number(i.min)||0;return q<0?'neg':q===0?'out':(mn&&q<=mn)?'low':'ok'}
function invLbl(i){if(!i)return '';if(i.kind==='other'||i.kind==='gen')return i.name;const bs=[i.b,i.sys].filter(Boolean).join(' ');
  return i.kind==='fix'?`${bs}، Ø${i.d} × ${i.l}`:`${KLBL[i.kind]} ${bs}، ${i.d}`}
function invUsage(){const m={};(INV.usage||[]).forEach(u=>m[u.item]=Number(u.n)||0);return m}
async function pollInv(force){if(!ROLE||INV.busy||!CF_ON)return;if(!force&&document.hidden)return;INV.busy=true;
  try{const j=await api('invGet',{ver:force?'':INV.ver},{prio:'poll'});setInvLive(true);if(j&&!j.same&&j.items){Object.assign(INV,{ver:j.ver,items:j.items,moves:j.moves||[],usage:j.usage||[],sups:j.sups||[],price:!!j.price,loaded:true});renderInv();if(INV.cur)refreshInvSheet()}}
  catch(e){if(e.message!=='aborted')setInvLive(false)}finally{INV.busy=false}}
function setInvLive(ok){const el=$('iLive');if(!el)return;el.classList.toggle('off',!ok);el.textContent=ok?'زنده':'اتصال قطع است؛ دوباره تلاش می‌شود…'}
function invBadge(){const n=INV.items.filter(i=>{const s=invState(i);return s==='low'||s==='out'||s==='neg'}).filter(i=>Number(i.min)||Number(i.qty)<0).length;const b=$('invBadge');b.hidden=!n||!['inventory','consultant','manager'].includes(ROLE);b.textContent=fa(n)}
function invSystems(){const map=new Map();const add=(M,v)=>{const k=nk(v);if(k&&!M.has(k))M.set(k,toEn(v).trim())};
  (SET.catalog||[]).forEach(c=>{const k=sysKey(c.b,c.sys);if(!map.has(k))map.set(k,{b:c.b,sys:c.sys,d:new Map(),l:new Map(),items:{},ok:new Set()});const s=map.get(k);(c.d||[]).forEach(v=>add(s.d,v));(c.l||[]).forEach(v=>add(s.l,v));(c.d||[]).forEach(d=>(c.l||[]).forEach(l=>s.ok.add(nk(d)+'x'+nk(l))))});
  INV.items.filter(i=>i.kind==='fix').forEach(i=>{const k=sysKey(i.b,i.sys);if(!map.has(k))map.set(k,{b:i.b,sys:i.sys,d:new Map(),l:new Map(),items:{}});const s=map.get(k);add(s.d,i.d);add(s.l,i.l);s.items[nk(i.d)+'x'+nk(i.l)]=i});
  const srt=M=>[...M.values()].sort((x,y)=>parseFloat(x)-parseFloat(y)||String(x).localeCompare(y));
  return [...map.values()].map(s=>({...s,d:srt(s.d),l:srt(s.l)}))}
function renderInv(){if($('viewInv').hidden&&ROLE!=='inventory'){invBadge();return}invBadge();i2Segs();
  const U=invUsage(),it=INV.items;
  const fixQ=it.filter(i=>i.kind==='fix').reduce((a,i)=>a+Math.max(0,Number(i.qty)||0),0);
  const low=it.filter(i=>invState(i)==='low').length,out=it.filter(i=>(invState(i)==='out'&&Number(i.min))||invState(i)==='neg').length;
  const used=Object.values(U).reduce((a,n)=>a+n,0);
  $('invKpis').innerHTML=`<div class="kpi"><b>${fa(fixQ)}</b><span>فیکسچر در انبار</span></div>
    <button type="button" class="kpi low" data-ikpi="low" aria-pressed="${INV.low}"><b>${fa(low)}</b><span>رو به اتمام</span></button>
    <button type="button" class="kpi out" data-ikpi="low" aria-pressed="${INV.low}"><b>${fa(out)}</b><span>تمام‌شده</span></button>
    <div class="kpi"><b>${fa(used)}</b><span>مصرف ۳۰ روز اخیر</span></div>${INV.price?`<div class="kpi"><b>${fa(it.reduce((a,i)=>a+(i.avg!=null?Math.round(i.avg*Math.max(0,(Number(i.qty)||0)-(Number(i.cq)||0))):0),0))}</b><span>ارزش انبار (تومان)</span></div>`:''}`;
  document.querySelectorAll('[data-iseg]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.iseg===INV.seg));$('invLow').setAttribute('aria-pressed',INV.low);
  $('invTools').hidden=INV.seg==='log'||!!INV3S[INV.seg];$('invAdd').hidden=!invCanEdit()||$('viewInv').hidden;
  const q=toEn($('invQ').value.trim()).toLowerCase(),match=s=>!q||toEn(s).toLowerCase().includes(q);
  const B=$('invBody');
  if(!INV.loaded){B.innerHTML='<div class="empty">در حال بارگذاری انبار…</div>';return}
  if(INV3S[INV.seg]){inv3Render(B);return}if(['rep','cnt','po','ifin','icat'].includes(INV.seg)){i2Render(B);return}
  if(INV.seg==='fix'){const sys=invSystems().filter(s=>match(s.b+' '+s.sys));
    if(!sys.length){B.innerHTML=`<div class="empty">${q?'نتیجه‌ای پیدا نشد.':'هنوز فیکسچری ثبت نشده.'+(invCanEdit()?' با «ورود کالا» اولین فیکسچرها را وارد کنید.':'')}${!(SET.catalog||[]).length?'<br>برای دیدن جدول کامل سایزها، برندها و سایزها را در «تنظیمات» وارد کنید.':''}</div>`;return}
    const top=it.filter(i=>U[i.id]).sort((a,b)=>U[b.id]-U[a.id]).slice(0,8),mx=top.length?U[top[0].id]:1;
    B.innerHTML=sys.map(s=>{const tot=Object.values(s.items).reduce((a,i)=>a+(Number(i.qty)||0),0);
      let rows=s.d.map(d=>{const cells=s.l.map(l=>{const i=s.items[nk(d)+'x'+nk(l)];if(!i&&s.ok&&s.ok.size&&!s.ok.has(nk(d)+'x'+nk(l)))return '<td></td>';if(INV.low&&!(i&&['low','out','neg'].includes(invState(i))))return `<td><span class="cell none" aria-hidden="true"></span></td>`;
        const st=i?invState(i):'none';return `<td><button type="button" class="cell ${st}" data-icell="${esc(s.b)}|${esc(s.sys)}|${esc(d)}|${esc(l)}" title="Ø${esc(d)} × ${esc(l)}">${i?fa(Number(i.qty)||0):'·'}</button></td>`}).join('');
        return `<tr><th class="r">Ø${esc(d)}</th>${cells}</tr>`}).join('');
      return `<section class="sys"><div class="sys-h"><div><b>${esc(s.b)}</b> <small>${esc(s.sys||'')}</small></div><span class="tot">${fa(tot)} عدد</span></div>
        <div class="mx"><table><thead><tr><th title="قطر / طول">Ø \\ L</th>${s.l.map(l=>`<th class="c">${esc(l)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section>`}).join('')+
      `<div class="mxlegend"><span><i style="background:var(--ok-soft);border:1px solid var(--ok)"></i>موجود</span><span><i style="background:var(--warn-soft);border:1px solid var(--warn)"></i>رو به اتمام (کمتر از حداقل)</span><span><i style="background:var(--bad-soft);border:1px solid var(--bad)"></i>تمام شده</span><span>ردیف‌ها قطر و ستون‌ها طول فیکسچر (mm)</span></div>`+
      (top.length?`<section class="sys"><div class="sys-h"><b>پرمصرف‌ترین‌ها در ۳۰ روز اخیر</b></div><div class="usage">${top.map(i=>`<div class="ubar"><span>${esc(invLbl(i))}</span><i style="width:${Math.max(4,U[i.id]/mx*100)}%"></i><b>${fa(U[i.id])}</b></div>`).join('')}</div></section>`:'');
    return}
  if(INV.seg==='acc'){const list=it.filter(i=>i.kind!=='fix'&&match(invLbl(i))&&(!INV.low||['low','out','neg'].includes(invState(i))));
    const grp=[['heal','هیلینگ و کاور',x=>x.kind==='heal'||x.kind==='cover'],['other','مواد مصرفی',x=>x.kind==='other']];
    const html=grp.map(([k,t,f])=>{const g=list.filter(f).sort((a,b)=>invLbl(a).localeCompare(invLbl(b),'fa'));if(!g.length)return '';
      return `<section class="sys"><div class="sys-h"><b>${t}</b><span class="tot">${fa(g.length)} قلم</span></div>${g.map(i=>{const st=invState(i);
        return `<button type="button" class="irow" data-iitem="${esc(i.id)}"><span class="nm"><b>${esc(invLbl(i))}</b><small>${Number(i.min)?'حداقل موجودی '+fa(i.min):'حداقل موجودی تعیین نشده'}${U[i.id]?'، مصرف ۳۰ روز: '+fa(U[i.id]):''}${INV.price&&i.avg!=null?'، میانگین بها: '+fa(i.avg)+' تومان':''}</small></span><span class="qty ${st==='neg'?'out':st}">${fa(Number(i.qty)||0)}<small>${esc(i.unit||'عدد')}</small></span></button>`}).join('')}</section>`}).join('');
    B.innerHTML=html||`<div class="empty">${q||INV.low?'موردی پیدا نشد.':'هنوز قلمی ثبت نشده.'+(invCanEdit()?' با «ورود کالا» هیلینگ، کاور یا مواد مصرفی را اضافه کنید.':'')}</div>`;return}
  const byId=Object.fromEntries(it.map(i=>[i.id,i]));
  B.innerHTML=INV.moves.length?`<section class="sys">${INV.moves.slice(0,200).map(m=>{const i=byId[m.item],d=Number(m.delta)||0;
    const ic=m.type==='in'?['in','+']:m.type==='adj'?['adj','≈']:m.type==='use'?['use','−']:['out','−'];
    const what=(I2T[m.type]||'خروج')+(INV.price&&m.type==='in'&&m.price!=null?' · '+fa(m.price)+' تومان':'')+(INV.price&&m.sup?' · '+i2SupN(m.sup):'')+(INV.price&&m.inv?' · فاکتور '+m.inv:'');
    return `<div class="mv"><span class="ic ${ic[0]}">${ic[1]}</span><div><b>${esc(invLbl(i)||'قلم حذف‌شده')}</b><small>${what}${m.refName?'، '+esc(m.refName):''}${m.note?'، '+invNote(m.note):''}${m.by?'، '+esc(m.by):''}</small><small>${esc(invTime(m.at))}، موجودی بعد: ${fa(Number(m.qty)||0)}</small></div><span class="d ${d>0?'p':'m'}">${d>0?'+':'−'}${fa(Math.abs(d))}</span></div>`}).join('')}</section>`
    :'<div class="empty">هنوز ورود یا خروجی ثبت نشده.</div>'}
function invTime(iso){try{const d=new Date(iso);return d.toLocaleDateString('fa-IR-u-ca-persian',{month:'long',day:'numeric'})+' ساعت '+d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
/* item sheet: one existing item (or an empty fixture size from the catalog) */
function openInvItem(item,spec){INV.cur=item?{id:item.id}:{spec};try{$('ivBy').value=localStorage.getItem('implantInvBy')||''}catch(e){}INV.mvType='in';$('ivN').value='1';$('ivNote').value='';$('ivMsg').textContent='';refreshInvSheet();$('invSheet').hidden=false}
function refreshInvSheet(){const c=INV.cur;if(!c)return;const i=c.id?INV.items.find(x=>x.id===c.id):INV.items.find(x=>x.kind==='fix'&&c.spec&&sysKey(x.b,x.sys)===sysKey(c.spec.b,c.spec.sys)&&nk(x.d)===nk(c.spec.d)&&nk(x.l)===nk(c.spec.l));
  if(i){c.id=i.id}const lbl=i?invLbl(i):invLbl(Object.assign({kind:'fix'},c.spec));const q=i?Number(i.qty)||0:0,st=i?invState(i):'out';
  $('ivTitle').textContent=lbl;$('ivQty').textContent=fa(q);$('ivQty').style.color=st==='ok'?'var(--ok)':st==='low'?'var(--warn)':'var(--bad)';
  $('ivUnit').textContent=(i&&i.unit)||'عدد';$('ivState').textContent=st==='ok'?'موجود':st==='low'?'رو به اتمام':q<0?'کسری (بیشتر از موجودی مصرف شده)':'تمام شده';
  const ed=invCanEdit();$('ivEdit').hidden=!ed;$('ivMinW').hidden=!ed||!i;if(i)$('ivMin').value=Number(i.min)||'';
  document.querySelectorAll('[data-ivt]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ivt===INV.mvType));
  $('ivNLbl').textContent=INV.mvType==='adj'?'تعداد شمارش‌شده در قفسه':INV.mvType==='in'?'تعداد ورودی':'تعداد خروجی';i2IvX(i);
  const U=invUsage();const mv=i?INV.moves.filter(m=>m.item===i.id).slice(0,12):[];
  $('ivHist').innerHTML=(i&&U[i.id]?`<p class="note">مصرف ۳۰ روز اخیر: ${fa(U[i.id])}</p>`:'')+(mv.length?mv.map(m=>{const d=Number(m.delta)||0;return `<div class="mv"><span class="ic ${m.type==='in'?'in':m.type==='adj'?'adj':'use'}">${m.type==='in'?'+':m.type==='adj'?'≈':'−'}</span><div><b>${m.type==='in'?'ورود':m.type==='adj'?'شمارش':m.type==='use'?'مصرف در جراحی':'خروج'}${m.refName?'، '+esc(m.refName):''}</b><small>${esc(invTime(m.at))}${m.note?'، '+invNote(m.note):''}${m.by?'، '+esc(m.by):''}</small></div><span class="d ${d>0?'p':'m'}">${d>0?'+':'−'}${fa(Math.abs(d))}</span></div>`}).join(''):'<p class="note">هنوز ورود یا خروجی برای این قلم ثبت نشده.</p>')}
async function invSaveMove(t){const c=INV.cur;if(!c)return;const m=$('ivMsg');const n=parseInt(toEn($('ivN').value),10);
  if(!(n>=0)||(INV.mvType!=='adj'&&!n)){m.className='msg err';m.textContent='تعداد را وارد کنید.';return}
  const by=invBy();t.disabled=true;m.className='msg';m.textContent='در حال ثبت…';
  try{const p=Object.assign({type:INV.mvType,n,note:$('ivNote').value.trim(),by,sendId:uuid()},i2IvRead());if(c.id)p.item=c.id;else p.spec=Object.assign({kind:'fix'},c.spec);
    const j=await api('invMove',p,{timeout:10000,tries:2});c.id=j.id;
    const mn=$('ivMin').value.trim();const it=INV.items.find(x=>x.id===j.id);if(!$('ivMinW').hidden&&it&&String(num(mn))!==String(Number(it.min)||0))await api('invItem',{id:j.id,min:num(mn)});
    toast(INV.mvType==='in'?`${fa(n)} عدد وارد انبار شد.`:INV.mvType==='out'?`${fa(n)} عدد از انبار خارج شد.`:INV.mvType==='ret'?`${fa(n)} عدد به تأمین‌کننده برگشت داده شد.`:INV.mvType==='waste'?`${fa(n)} عدد ضایعات ثبت شد.`:'موجودی اصلاح شد.');INV.mvType='in';$('ivN').value='1';$('ivNote').value='';m.textContent='';await pollInv(true);refreshInvSheet()}
  catch(e){m.className='msg err';m.textContent=e.message}finally{t.disabled=false}}
async function invSaveMin(t){const c=INV.cur;if(!c||!c.id)return;t.disabled=true;try{await api('invItem',{id:c.id,min:num($('ivMin').value)});toast('حداقل موجودی ذخیره شد.');await pollInv(true)}catch(e){$('ivMsg').className='msg err';$('ivMsg').textContent=e.message}finally{t.disabled=false}}
function invBy(){const v=$('ivBy')?$('ivBy').value.trim():'';try{if(v)localStorage.setItem('implantInvBy',v)}catch(e){}return v||(()=>{try{return localStorage.getItem('implantInvBy')||''}catch(e){return ''}})()}
/* new stock sheet */
function openInvNew(){INV.kind='fix';$('inMsg').textContent='';$('in_n').value='1';$('in_note').value='';['in_b','in_sys','in_d','in_l','in_hs','in_name'].forEach(id=>$(id).value='');$('in_unit').value='عدد';
  $('in_cat').innerHTML=(catM().length?'<option value="">— انتخاب کنید —</option>'+catM().map((c,i)=>`<option value="${i}">${esc(c.b+(c.sys?' '+c.sys:''))}</option>`).join(''):'')+'<option value="m">سایر (نوشتن دستی)</option>';
  $('in_cat').value=catM().length?'':'m';$('in_sug').innerHTML=INV_SUG.map(s=>`<button type="button" class="chip" data-isug="${esc(s)}">${esc(s)}</button>`).join('');
  try{$('in_by').value=localStorage.getItem('implantInvBy')||''}catch(e){}invNewSync();$('invMvSheet').hidden=false}
function invNewSync(){const k=INV.kind,c=catM()[$('in_cat').value];document.querySelectorAll('[data-ikind]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ikind===k));
  $('in_catW').hidden=k==='other';$('in_manW').hidden=k==='other'||!!c;$('in_fixW').hidden=k!=='fix';$('in_hsW').hidden=k==='fix'||k==='other';$('in_othW').hidden=k!=='other';
  const fill=(S,I,vals)=>{const has=c&&vals&&vals.length;S.hidden=!has;I.hidden=!!has;if(has){const v=S.value;S.innerHTML='<option value="">—</option>'+vals.map(x=>`<option${v===x?' selected':''}>${esc(x)}</option>`).join('')}};
  fill($('in_dS'),$('in_d'),c&&c.d);const idv=$('in_dS').hidden?toEn($('in_d').value).trim():$('in_dS').value;fill($('in_lS'),$('in_l'),catLens(c,idv));fill($('in_hS'),$('in_hs'),c&&c.h)}
async function invSaveNew(t){const m=$('inMsg'),k=INV.kind,c=catM()[$('in_cat').value];const pv=(S,I)=>S.hidden?toEn(I.value).trim():S.value;
  const spec={kind:k,b:c?c.b:$('in_b').value.trim(),sys:c?c.sys:$('in_sys').value.trim(),d:k==='fix'?pv($('in_dS'),$('in_d')):pv($('in_hS'),$('in_hs')),l:pv($('in_lS'),$('in_l')),name:$('in_name').value.trim(),unit:$('in_unit').value.trim()};
  const n=parseInt(toEn($('in_n').value),10);
  const err=k==='other'?(!spec.name&&'نام قلم را بنویسید.'):(!spec.b?'برند را انتخاب کنید.':k==='fix'&&(!spec.d||!spec.l)?'قطر و طول فیکسچر را انتخاب کنید.':k!=='fix'&&!spec.d?'سایز را وارد کنید.':'');
  if(err){m.className='msg err';m.textContent=err;return}if(!(n>0)){m.className='msg err';m.textContent='تعداد را وارد کنید.';return}
  const by=$('in_by').value.trim();try{localStorage.setItem('implantInvBy',by)}catch(e){}
  t.disabled=true;m.className='msg';m.textContent='در حال ثبت…';
  try{await api('invMove',{type:'in',n,spec,note:$('in_note').value.trim(),by,sendId:uuid()},{timeout:10000,tries:2});
    toast(`${fa(n)} عدد ${invLbl(Object.assign({},spec))} وارد انبار شد.`);$('invMvSheet').hidden=true;INV.seg=k==='fix'?'fix':'acc';await pollInv(true)}
  catch(e){m.className='msg err';m.textContent=e.message}finally{t.disabled=false}}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='tabInv'){if(dirty&&!t.dataset.armed){t.dataset.armed='1';alertMsg('تغییرات این فرم ذخیره نشده. برای رفتن به انبار دوباره بزنید.');setTimeout(()=>delete t.dataset.armed,4000);return}delete t.dataset.armed;show('inv');renderInv();pollInv(true);return}
  if(t.dataset.iseg){INV.seg=t.dataset.iseg;renderInv();return}
  if(t.id==='invLow'||t.dataset.ikpi){INV.low=!INV.low;if(INV.low&&INV.seg==='log')INV.seg='fix';renderInv();return}
  if(t.dataset.icell){const [b,sys,d,l]=t.dataset.icell.split('|');const s=invSystems().find(x=>sysKey(x.b,x.sys)===sysKey(b,sys));const i=s&&s.items[nk(d)+'x'+nk(l)];openInvItem(i||null,i?null:{b,sys,d,l});return}
  if(t.dataset.iitem){openInvItem(INV.items.find(x=>x.id===t.dataset.iitem),null);return}
  if(t.dataset.ivt){INV.mvType=t.dataset.ivt;if(INV.mvType==='adj'){const i=INV.items.find(x=>INV.cur&&x.id===INV.cur.id);$('ivN').value=i?Math.max(0,Number(i.qty)||0):0}else $('ivN').value='1';refreshInvSheet();return}
  if(t.dataset.ivs){const v=(parseInt(toEn($('ivN').value),10)||0)+Number(t.dataset.ivs);$('ivN').value=Math.max(0,v);return}
  if(t.dataset.ins){const v=(parseInt(toEn($('in_n').value),10)||0)+Number(t.dataset.ins);$('in_n').value=Math.max(1,v);return}
  if(t.id==='ivSave'){invSaveMove(t);return}if(t.id==='ivMinSave'){invSaveMin(t);return}if(t.id==='ivClose'){INV.cur=null;$('invSheet').hidden=true;return}
  if(t.id==='invAdd'){i2OpenRecv();return}if(t.id==='inClose'){$('invMvSheet').hidden=true;return}if(t.id==='inSave'){invSaveNew(t);return}
  if(t.dataset.ikind){INV.kind=t.dataset.ikind;invNewSync();return}
  if(t.dataset.isug){$('in_name').value=t.dataset.isug;return}});
document.addEventListener('change',e=>{if(e.target.id==='in_cat')invNewSync()});
document.addEventListener('input',e=>{if(e.target.id==='invQ')renderInv()});
setInterval(()=>{if(ROLE&&CF_ON&&(!$('viewInv').hidden||ROLE==='inventory'))pollInv(false)},4000);

