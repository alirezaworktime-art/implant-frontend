/* ---------- model ---------- */
const BRANDS=[{k:'ir',n:'ایرانی'},{k:'ko',n:'کره‌ای'},{k:'it',n:'ایتالیایی'},{k:'sw',n:'سوئیسی'},{k:'rt',n:'Root'}];
const bz=f=>Object.fromEntries(BRANDS.map(b=>[b.k,f?f(b.k):0]));
/* kinds: teeth (Palmer chart; optional cnt:'jaws' (تعداد کل) / cnt:'jaw' (Full EXT): per-jaw count that REPLACES and locks manual tooth selection in that jaw; optional groups = extra chips)
          chips · items (sub-items each with its own price: chips per side, or a count select) · none
   price: unit (qty × price) · flat · brandUnit (qty × brand price) · implantBrand (implants × implant brand price) · items */
const SECTIONS=[
 {id:'ext',t:'کشیدن دندان',kind:'teeth',n:8,price:'unit',cnt:'jaw',jmax:16},
 {id:'imp',t:'پایه ایمپلنت',kind:'teeth',n:7,price:'brandUnit',cnt:'jaws',jmax:14,text:'توضیحات'},
 {id:'gbr',t:'جراحی GBR',kind:'teeth',n:7,price:'unit',cnt:'jaws',jmax:14,both:true},
 {id:'sin',t:'سینوس لیفت',kind:'items',price:'items',two:true,items:[{k:'o',l:'سینوس باز',type:'chips',o:['چپ','راست'],pk:'sin_o'},{k:'c',l:'سینوس بسته',type:'chips',o:['چپ','راست'],pk:'sin_c'}],excl:{'o:راست':'c:راست','c:راست':'o:راست','o:چپ':'c:چپ','c:چپ':'o:چپ'}},
 {id:'alv',t:'آلوئولوپلاستی',kind:'quad',price:'unit',ul:'هر Q'},
 {id:'pon',t:'پایه پونتیک',kind:'teeth',n:7,price:'unit',cnt:'jaws',jmax:14},
 {id:'surg',t:'جراحی دندان نهفته',kind:'items',price:'items',two:true,items:[{k:'c',l:'جراحی نیش نهفته',type:'quad',pk:'surg_c',ul:'هر دندان',tn:7},{k:'w',l:'جراحی عقل نهفته',type:'quad',pk:'surg_w',ul:'هر دندان'}]},
 {id:'sub',t:'ایمپلنت ساب‌پریوستئال',kind:'teeth',n:7,price:'unit',cnt:'jaws',jmax:14},
 {id:'aox',t:'All on X',sgt:7,kind:'chips',groups:[{l:'فک بالا',o:['4','5','6','7','8'],single:true},{l:'فک پایین',o:['4','5','6','7','8'],single:true}],price:'aox',prosJaw:true,def:'19000000',
   xp:[{k:'cb',pk:'aox_cb',l:'All on X · هر پایه پلاس (ایتالیایی)'},{k:'mz',pk:'aox_z',l:'All on X · هر پایه زایگوما'},{k:'mt',pk:'aox_t',l:'All on X · هر پایه تریگوئید'},{k:'mn',pk:'aox_n',l:'All on X · هر پایه نازال'}]},
 {id:'vip',t:'جراحی VIP / GBR',kind:'items',price:'items',two:true,items:[{k:'cgf',l:'CGF',type:'quad',qn:8,pk:'vip_cgf',ul:'هر عدد'},{k:'mem',l:'ممبران و تگ',type:'quad',qn:8,pk:'vip_mem',ul:'هر عدد'}]},
 {id:'crw',t:'فقط روکش',kind:'teeth',n:7,price:'unit',cnt:'jaws',jmax:14,pros:true},
 {id:'ram',t:'پیوند استخوان بلاک راموس',kind:'teeth',n:7,price:'unit',cnt:'jaws',jmax:14},
 {id:'ovd',t:'اوردنچر',sgt:7,kind:'chips',groups:[{l:'فک بالا، تعداد پایه',o:['2','3','4','5'],single:true},{l:'فک پایین، تعداد پایه',o:['2','3','4','5'],single:true}],price:'implantBrand'},
 {id:'fgg',t:'FGG و وستیبولوپلاستی',kind:'chips',groups:[{l:'فک بالا',o:['⅓ خلف راست','⅓ قدام','⅓ خلف چپ']},{l:'فک پایین',o:['⅓ خلف راست','⅓ قدام','⅓ خلف چپ']}],text:'زمان',price:'unit'},
 {id:'tmp',t:'روکش موقت',kind:'teeth',n:7,cnt:'jaws',jmax:14,groups:[{l:'نوع',o:['دنچر','Essix','PMMA']}],price:'unit',pros:true},
 {id:'cbct',t:'CT scan',kind:'quad',items:[{k:'z',l:'CBCT زایگوما، تریگوئید و نازال',type:'toggle'},{k:'zs',l:'CBCT ساب‌پریوستئال',type:'toggle'}]},
 {id:'cons',t:'رضایت‌نامه',kind:'chips',groups:[{o:['نزدیک به عصب','دندان سالم']}]},
 {id:'anes',t:'زمان بیهوشی',kind:'none',text:'مدت',price:'flat'}
];
const SEC=Object.fromEntries(SECTIONS.map(x=>[x.id,x]));
const DEFAULT_SET={recipient:'',clinic:'کلینیک دندانپزشکی شهید رهنمون',doctor:'دکتر سید مجتبی علویکیا · جراح فک و صورت',phone:'۰۹۱۲۰۰۰۰۰۰۱ (منتظری)',prices:{}};
let SET={...DEFAULT_SET};
const FA_NF=new Intl.NumberFormat('fa-IR');const fa=n=>FA_NF.format(Math.round(n));
const toEn=s=>String(s||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const num=s=>Number(toEn(s).replace(/[^\d]/g,''))||0;
const fmtInput=v=>{const n=num(v);return n?n.toLocaleString('en-US'):''};
const faD=s=>String(s??'').replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const JFMT=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}),JMEMO=new Map();
function jalali(d){const k=d.getFullYear()*10000+d.getMonth()*100+d.getDate(),c=k===k?JMEMO.get(k):null;if(c)return {dash:c.dash,slash:c.slash};const p={};JFMT.formatToParts(d).forEach(x=>p[x.type]=x.value);const r={dash:`${p.year}-${p.month}-${p.day}`,slash:`${p.year}/${p.month}/${p.day}`};if(k===k){if(JMEMO.size>20000)JMEMO.clear();JMEMO.set(k,r)}return {dash:r.dash,slash:r.slash}}
function blankSections(){const s={},P=(SET&&SET.prices)||{};SECTIONS.forEach(x=>{const t=P[x.id]||{},bp=t.bp||{},ip={};
    (x.items||[]).concat(x.xp||[]).forEach(it=>ip[it.k]=fmtInput((P[it.pk]||{}).price||it.def||(it.k==='cb'||it.k==='lb'?((P.imp||{}).bp||{}).it:'')));
    s[x.id]={sel:{},text:'',price:fmtInput(t.price||x.def),bp:bz(k=>fmtInput(bp[k]||(x.id==='imp'&&k==='rt'?'21000000':''))),cnt:'',jc:{U:'',L:''},ip,isel:{},icnt:{},sp:[]}});
  return s}
/* medical history (filled at reception; default = No) */
const MED_Q=[['cur','آیا در حال حاضر مبتلا به بیماری خاصی هستید؟'],['drug','آیا تحت درمان دارویی بوده یا هستید؟'],['dent','آیا در درمان‌های دندانپزشکی دچار مشکل شده‌اید؟'],['alg','آیا به دارو یا غذایی حساسیت داشته‌اید؟'],['hosp','آیا سابقه‌ی بستری در بیمارستان دارید؟']];
const YR=['کمتر از یک سال','بیشتر از یک سال'];
const MED_D=[['diab','دیابت',['قند ناشتا بالای ۱۸۰','قند ناشتا زیر ۱۸۰']],['bp','فشار خون'],['angio','سابقه جراحی آنژیوگرافی',YR],['ohs','عمل قلب باز',YR],['chemo','سابقه شیمی‌درمانی یا پرتودرمانی'],['cort','مصرف داروهای کورتون'],['resp','بیماری تنفسی'],['seiz','سابقه تشنج']];
/* items of the previous form (kept only so older records still show what was recorded) */
const MED_OLD=[['heart','بیماری قلبی'],['asthma','تنگی نفس (آسم)'],['infect','بیماری‌های عفونی'],['hep','زردی، یرقان، هپاتیت'],['thyroid','تیروئید'],['diab','بیماری قند (دیابت)'],['preg','بارداری'],['bp','فشار خون'],['addict','اعتیاد'],['blood','بیماری‌های خونی'],['gi','بیماری گوارشی'],['liver','بیماری کبدی'],['tb','سل'],['neuro','بیماری‌های عصبی (تشنج، صرع…)'],['aids','ایدز'],['joint','درد مفاصل'],['rheum','تب روماتیسمی']];
const blankMed=()=>({y:{},t:{},other:''});
function medNorm(m){m=m||{};return {y:{...(m.y||{})},t:{...(m.t||{})},other:m.other||''}}
function medList(m){m=medNorm(m);const L=[];MED_Q.forEach(([k,l])=>{if(m.y[k])L.push(l.replace(/^آیا /,'').replace(/؟$/,'')+((m.t[k]||'').trim()?': '+m.t[k].trim():''))});
  const d=medDis(m);if(d.length)L.push('مبتلا: '+d.join('، '));if(m.other.trim())L.push('توضیحات: '+m.other.trim());return L}
const medDis=m=>MED_D.filter(([k])=>m.y[k]).map(([k,l,o])=>l+(o&&m.t[k]?' ('+m.t[k]+')':'')+(k==='diab'&&m.y.hba?' · قند سه ماهه (HbA1c)'+(m.t.hba?' '+m.t.hba:''):'')).concat(MED_OLD.filter(([k])=>m.y[k]&&!MED_D.some(x=>x[0]===k)).map(([,l])=>l));
function medShort(m){m=medNorm(m);const a=medDis(m);if(m.y.alg)a.push('حساسیت'+(m.t.alg?' ('+m.t.alg+')':''));MED_Q.forEach(([k,l])=>{if(k!=='alg'&&m.y[k])a.push(l.replace(/^آیا /,'').replace(/؟$/,''))});if(m.other.trim())a.push(m.other.trim());return a.join('، ')}
function medHTML(m){m=medNorm(m);const yn=(k)=>`<span class="yn"><button type="button" data-mk="${k}" data-mv="0" aria-pressed="${!m.y[k]}">خیر</button><button type="button" data-mk="${k}" data-mv="1" aria-pressed="${!!m.y[k]}">بله</button></span>`;
  return `<h3>وضعیت عمومی بیمار</h3><div class="medq">`+MED_Q.map(([k,l])=>`<div class="mrow"><span>${l}</span>${yn(k)}${m.y[k]?`<input data-mt="${k}" value="${esc(m.t[k]||'')}" placeholder="${k==='hosp'?'به چه علت؟':'توضیح'}">`:''}</div>`).join('')+'</div>'+
    `<h3>آیا به هیچ‌کدام از حالات و بیماری‌های زیر مبتلا بوده یا هستید؟</h3><div class="mgrid">`+MED_D.map(([k,l,o])=>`<div class="mrow"><span>${l}</span>${yn(k)}${o&&m.y[k]?`<span class="msub">${o.map(v=>`<button type="button" class="chip" data-ms="${k}" data-msv="${esc(v)}" aria-pressed="${m.t[k]===v}">${v}</button>`).join('')}</span>`:''}${k==='diab'&&m.y[k]?`<span class="msub hba"><button type="button" class="chip tick" data-mhb aria-pressed="${!!m.y.hba}">${m.y.hba?'☑':'☐'} قند سه ماهه (HbA1c)</button>${m.y.hba?['زیر ۷٫۵','بالای ۷٫۵'].map(v=>`<button type="button" class="chip" data-ms="hba" data-msv="${v}" aria-pressed="${m.t.hba===v}">${v}</button>`).join(''):''}</span>`:''}</div>`).join('')+`</div>`+
    (MED_OLD.some(([k])=>m.y[k]&&!MED_D.some(x=>x[0]===k))?`<p class="note">ثبت‌شده در فرم قبلی: ${MED_OLD.filter(([k])=>m.y[k]&&!MED_D.some(x=>x[0]===k)).map(([,l])=>l).join('، ')}</p>`:'')+
    `<label class="f full" style="margin-top:8px">توضیحات<textarea data-mo rows="2" placeholder="بیماری یا نکته‌ای که در لیست نیست">${esc(m.other)}</textarea></label>`}
let RC_MED=blankMed();
const medOf=box=>box==='rc'?RC_MED:(F.med=F.med||blankMed());
function renderMed(box){const el=$(box==='rc'?'rcMed':'fMed');if(el)el.innerHTML=medHTML(medOf(box))}
function blankForm(){return {id:null,med:blankMed(),h:{date:jalali(new Date()).slash,doc:''},s:blankSections(),s2:null,alt:{mode:'none',text:''},brand:'ref',pay:{opt:'1',n1:'',m2:'',n3:'',disc:''},status:'new'}}
let F=blankForm();
let CUR=1; // which plan is on screen (1 or 2)
let ARCHIVE=[];
let dirty=false;
const PV=(r,n)=>({s:n>=2?(((r.sx||[])[n-2])||r.s2||r.s):r.s,brand:r.brand,pay:r.pay});   // plan view used by calc + PDF
let SURG=null; // surgery-day session being filled (sections + implants); null outside the surgery view
const AS=()=>SURG?SURG.s:(CUR>=2&&F.sx&&F.sx[CUR-2]?F.sx[CUR-2]:F.s);                              // sections of the plan on screen

