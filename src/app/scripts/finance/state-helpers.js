/* ---------- state + helpers ---------- */
const FIN={sec:'xform',cat:null,pl:null,per:{},led:{acc:'1106',party:''},inv:null,pay:{t:'doctor'},rec:{}};
const FSEC=[['dash','داشبورد مالی'],['inv','صورتحساب‌ها'],['rcv','دریافت‌ها و چک‌ها'],['pay','پرداخت و خرید'],['chq','چک‌های پرداختنی'],['bank','بانک و صندوق'],['doc','سهم پزشکان'],['emp','حقوق پرسنل'],
  ['jrn','اسناد حسابداری'],['led','دفاتر و تراز'],['fs','صورت‌های مالی'],['prof','سود بیمار و پزشک'],['xl','گزارش‌های اکسل'],['bud','بودجه'],['tax','مالیات و بیمه'],['set','تنظیمات مالی']];
const jToday=()=>toEn(jalali(new Date()).slash);
const jYM=()=>{const [y,m]=jToday().split('/').map(Number);return [y,m]};
function jmRange(y,m){const from=parseJ(`${y}/${m}/1`),ny=m===12?y+1:y,nm=m===12?1:m+1,to=dAdd(parseJ(`${ny}/${nm}/1`),-1);return {k:`${y}-${String(m).padStart(2,'0')}`,from,to,l:FMON[m-1]+' '+fa(y).replace(/٬/g,'')}}
const FPRE=[['t','امروز'],['m','این ماه'],['pm','ماه قبل'],['q','سه ماه اخیر'],['y','امسال'],['a','همه']];
function perRange(k){const [y,m]=jYM(),td=tDay();if(k==='t')return {from:td,to:td};if(k==='m'){const r=jmRange(y,m);return {from:r.from,to:td}}if(k==='pm'){const r=m===1?jmRange(y-1,12):jmRange(y,m-1);return {from:r.from,to:r.to}}
  if(k==='q')return {from:dAdd(td,-90),to:td};if(k==='y')return {from:parseJ(`${y}/1/1`),to:td};return {from:'2000-01-01',to:td}}
function perHTML(id,def){const p=FIN.per[id]||(FIN.per[id]=perRange(def||'m'));return `<div class="fper" data-per="${id}"><label class="f">از<input data-pf="from" inputmode="numeric" value="${p.from>'2000-01-02'?esc(jDay(p.from)):''}" placeholder="ابتدا"></label><label class="f">تا<input data-pf="to" inputmode="numeric" value="${esc(jDay(p.to))}"></label>
  <span class="chips">${FPRE.map(([k,l])=>`<button type="button" class="chip" data-perk="${id}:${k}">${l}</button>`).join('')}</span><button type="button" class="btn sm" data-pergo="${id}">نمایش</button></div>`}
function perRead(id){const w=document.querySelector(`[data-per="${id}"]`);if(!w)return FIN.per[id];const f=parseJ(w.querySelector('[data-pf="from"]').value.trim())||'2000-01-01',t=parseJ(w.querySelector('[data-pf="to"]').value.trim())||tDay();FIN.per[id]={from:f,to:t};return FIN.per[id]}
const perSub=id=>{const p=FIN.per[id]||{};return (p.from&&p.from>'2000-01-02'?'از '+jDay(p.from)+' ':'')+'تا '+jDay(p.to||tDay())};
const mnyIn=(id,v,ph)=>`<input id="${id}" class="mny" inputmode="numeric" value="${v?fa(v):''}" placeholder="${esc(ph||'')}">`;
const mv=id=>{const e=$(id);return e?(parseInt(toEn(e.value).replace(/[^\d]/g,''),10)||0):0};
const accN=c=>{const a=(FIN.cat&&FIN.cat.accs||[]).find(x=>x.code===c);return a?a.name:c};
const leafAccs=f=>(FIN.cat.accs||[]).filter(a=>a.code.length>=4&&a.active&&(!f||f(a)));
const accOpts=(f,sel)=>leafAccs(f).map(a=>`<option value="${a.code}"${a.code===sel?' selected':''}>${a.code} — ${esc(a.name)}</option>`).join('');
const moneyAccs=()=>(FIN.cat.banks||[]).filter(b=>b.active);
const moneyOpts=sel=>moneyAccs().map(b=>`<option value="${b.acc}"${b.acc===sel?' selected':''}>${esc(b.name)}${b.accno?' · '+esc(b.accno):''}</option>`).join('');
const payeeN=id=>((FIN.cat.payees||[]).find(p=>p.id===id)||{}).name||'';
const partyLbl=(p,n)=>{if(!p)return '';if(n)return n;if(p.startsWith('d:'))return payeeN(p.slice(2));if(p.startsWith('s:'))return ((FIN.cat.emps||[]).find(e=>e.id===p.slice(2))||{}).name||p;return p};
const SRCL={inv:'صورتحساب',pay:'دریافت از بیمار',mpay:'پرداخت',exp:'هزینه',cash:'بستن صندوق',man:'سند دستی',open:'افتتاحیه',rcv:'دریافت',xfer:'انتقال',buy:'خرید',chqo:'صدور چک',chqp:'پاس چک',payroll:'حقوق'};
async function finCat(force){if(!FIN.cat||force){FIN.cat=await api('finCatalog')}return FIN.cat}
async function finPlans(){if(!FIN.pl){const j=await api('list');FIN.pl=(j.items||[]).map(x=>({id:x.id,name:x.name||'',nid:x.nid||''}))}return FIN.pl}
function finMsg(t,bad){const m=$('finMsg');if(m){m.className='msg '+(bad?'err':'ok');m.textContent=t;if(t)m.scrollIntoView({block:'nearest'})}if(t)toast(t,bad)}

