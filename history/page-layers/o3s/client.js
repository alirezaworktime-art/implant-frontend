<script>/* ---------- o3s (owner, 2026-11-27): option 3 = the agreed % (default 70) of the SURGERY part as cash before surgery; the rest (rest of the surgery part + prosthesis) has no cheque and is paid any time, any amount, until the impression day ---------- */
const o3sCash=(r,S)=>Math.round((Number(S)||0)*pl10Pct(r)/100/1e5)*1e5;
const o3sRest=(S,P,C)=>`مانده ${fa(Math.max(0,S+P-C))} بدون چک، هر زمان و هر مبلغ تا روز قالب‌گیری`;
/* reception's collection sheet + everything that reads chqFor: before and after surgery only pct% of the surgery part is asked */
{const _c=chqFor;chqFor=function(r){const o=_c.apply(this,arguments);try{if(pl10O3(r)){const C=Math.min(o.S,o3sCash(r,o.S));return Object.assign({},o,{cash:C,cashS:C,cashP:0,disc:0,chq:[]})}}catch(e){}return o}}
{const _c=cashFor;cashFor=function(r,S,P){try{if(pl10O3(r))return o3sCash(r,S)}catch(e){}return _c.apply(this,arguments)}}
{const _p=payText;payText=function(r,brand){const o=_p.apply(this,arguments);try{if(pl10O3(r)){const T=totals(r),b=brand||effBrand(r),S=T.surg[b]||0,P=T.pros||0,C=o3sCash(r,S);return {surg:`${fa(pl10Pct(r))}٪ پارت جراحی نقد قبل از جراحی: ${fa(C)}`,pros:o3sRest(S,P,C)}}}catch(e){}return o}}
/* the consultant's form: the % field and its note */
{const _u=pl10PayUI;pl10PayUI=function(){const x=_u.apply(this,arguments);try{const p=F&&F.pay;if(p&&String(p.opt)==='3'){const ci=$('p_c3'),lb=ci&&ci.closest('label');if(lb&&lb.firstChild&&lb.firstChild.nodeType===3)lb.firstChild.textContent='درصد نقد قبل از جراحی (از پارت جراحی)';
  const n=$('pl10C3N');if(n&&!n.hidden){const T=totals({s:AS(),brand:F.brand,pay:p}),b=effBrand(F),S=T.surg[b]||0,P=T.pros||0,C=o3sCash(F,S);n.textContent=`${fa(pl10Pct(F))}٪ پارت جراحی (${fa(S)}) = ${fa(C)} نقد قبل از جراحی · `+o3sRest(S,P,C)}}}catch(e){}return x}}
{const _n=cashNoteRender;cashNoteRender=function(){try{if(F&&F.pay&&String(F.pay.opt)==='3'){const el=$('cashNote');if(el)el.innerHTML='';return}}catch(e){}return _n.apply(this,arguments)}}
/* patient PDF: cash column = pct% of the surgery part, nothing in the prosthesis column, no cheques; the «other brands» line */
{const _q=q8Cash;q8Cash=function(r,S,P,which){try{if(pl10O3(r))return which==='s'?o3sCash(r,S):0}catch(e){}return _q.apply(this,arguments)}}
{const _q=q8Chq;q8Chq=function(r,S,frac,n,opt){try{if(pl10O3(r))return S?'بدون چک — مانده تا روز قالب‌گیری':'—'}catch(e){}return _q.apply(this,arguments)}}
{const _b=payBlock;payBlock=function(r){if(!(r&&pl10O3(r)))return _b.apply(this,arguments);const _tb=textBlock;textBlock=function(t,L){try{if(Array.isArray(L))L=L.map(l=>typeof l==='string'&&/^برای سایر برندها هم پیش‌پرداخت/.test(l)?`برای سایر برندها هم: ${fa(pl10Pct(r))}٪ پارت جراحی نقد قبل از جراحی (ستون پرداخت نقدی)؛ بقیه بدون چک تا روز قالب‌گیری.`:l)}catch(e){}return _tb.call(this,t,L)};try{return _b.apply(this,arguments)}finally{textBlock=_tb}}}
/* reception: suggested payments (two rows for the rest: surgery part s, prosthesis part p) and no cheque plan */
{const _s=paySugs;paySugs=function(r){try{if(pl10O3(r)){const T=totals(PV(r,1)),b=effBrand(r),S=T.surg[b]||0,P=T.pros||0,C=o3sCash(r,S);return [['cash','s',C,`نقد قبل از جراحی (${fa(pl10Pct(r))}٪ پارت جراحی)`],['cash','s',Math.max(0,S-C),'مانده‌ی پارت جراحی — تا روز قالب‌گیری'],['cash','p',P,'پارت پروتز — تا روز قالب‌گیری']].filter(s=>s[2]>0)}}catch(e){}return _s.apply(this,arguments)}}
{const _g=chqGen;chqGen=function(){const x=_g.apply(this,arguments);try{if(x&&x.r&&pl10O3(x.r))return Object.assign({},x,{out:[]})}catch(e){}return x}}
</script>
