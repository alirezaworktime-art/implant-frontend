/* ---------- PDF drawing ---------- */
const PW=1240,PH=1754,M=56,FONT='Vazirmatn, Tahoma, sans-serif';
const C={R:PW-M,L:M,labW:235,priceW:255};C.labL=C.R-C.labW;C.priceR=C.L+C.priceW;C.midL=C.priceR;C.midR=C.labL;C.midW=C.midR-C.midL;
const INK='#111',GREY='#8a8a8a',RULE='#555',FAINT='#f1f1f1';
let MC=null;const mctx=()=>MC||(MC=document.createElement('canvas').getContext('2d'));
function setF(c,o){c.font=`${o.w||400} ${o.s||21}px ${FONT}`}
function T(c,str,X,Y,o={}){setF(c,o);c.fillStyle=o.c||INK;c.textAlign=o.a||'right';c.direction='rtl';c.textBaseline='middle';c.fillText(str,X,Y)}
function Wd(c,str,o={}){setF(c,o);c.direction='rtl';return c.measureText(str).width}
function wrap(c,str,maxW,o){const words=String(str).split(/\s+/).filter(Boolean),lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(Wd(c,t,o)>maxW&&cur){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);return lines.length?lines:['']}
function box(c,x,y,w,h,fill,stroke,lw=1.5){if(fill){c.fillStyle=fill;c.fillRect(x,y,w,h)}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.strokeRect(x,y,w,h)}}
function checkbox(c,xR,yC,on){const s=20,x=xR-s,y=yC-s/2;if(on){box(c,x,y,s,s,INK);c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(x+4,y+10);c.lineTo(x+8,y+15);c.lineTo(x+16,y+5);c.stroke()}else box(c,x,y,s,s,null,'#999',1.5)}
function tooth(c,x,y,w,h,n,on){if(on){box(c,x,y,w,h,INK);T(c,fa(n),x+w/2,y+h/2+1,{s:20,w:800,c:'#fff',a:'center'})}else{box(c,x,y,w,h,null,'#c4c4c4',1);T(c,fa(n),x+w/2,y+h/2+1,{s:18,c:'#a0a0a0',a:'center'})}}

function chipLine(c,items,maxW){const lines=[];let line=[],used=0;items.forEach(it=>{if(used+it.w>maxW&&line.length){lines.push(line);line=[];used=0}line.push(it);used+=it.w});if(line.length)lines.push(line);return lines}
function chipItems(c,groups,isOn){const out=[];groups.forEach((g,gi)=>{const ln=[];
  if(g.l)ln.push({label:g.l+':',w:Wd(c,g.l+':',{w:700,s:19})+16});
  g.o.forEach(o=>{const on=isOn(gi,o),tx=faD(o);ln.push({text:tx,on,w:28+Wd(c,tx,{w:on?800:400,s:20})+26})});out.push(ln)});return out}
function drawChipLines(draws,lines,mh){lines.forEach((ln,li)=>{const yy=mh+li*36;
  draws.push((cx,top)=>{let cur=C.midR-14;const y=top+14+yy+16;ln.forEach(it=>{if(it.label){T(cx,it.label,cur,y,{s:19,w:700,c:'#333'});cur-=it.w}
    else if(it.note){T(cx,it.note,cur,y,{s:19,w:700});cur-=it.w}
    else{checkbox(cx,cur,y,it.on);T(cx,it.text,cur-28,y,{s:20,w:it.on?800:400,c:it.on?INK:'#777'});cur-=it.w}})})});
  return lines.length*36}
function priceLines(r,x){const s=r.s[x.id],q=qty(s,x),L=[];if(!x.price)return L;
  if(x.price==='unit'){const u=num(s.price);if(q&&u){L.push({t:`${fa(q)} ${x.kind==='quad'?'Q':'واحد'} × ${fa(u)}`,c:'#444',s:18});L.push({t:fa(q*u),b:1})}}
  else if(x.price==='flat'){const v=rowTotals(r,x).flat;if(v)L.push({t:fa(v),b:1})}
  else if(x.price==='aox'){const t=rowTotals(r,x),Lg=!!s.isel['t:long'];if(Lg){if(t.flat)L.push({t:`پایه‌ها: ${fa(t.flat)}`,c:'#444',s:17});if(t.pros)L.push({t:`پروتز: ${fa(t.pros)}`,c:'#444',s:17})}else{if(q){const m=['U','L'].map(j=>aoxMix(s,j));const tot=k=>m.reduce((a,x)=>a+x[k],0);if(tot('p'))L.push({t:`${fa(tot('p'))} پلاس × ${fa(num(s.ip.cb))}`,c:'#444',s:17});MXT.forEach(([k,l,pk])=>{if(tot(k))L.push({t:`${fa(tot(k))} ${l} × ${fa(num(s.ip[pk]))}`,c:'#444',s:17})})}if(t.pros)L.push({t:`پروتز: ${fa(qty(s,x))} پایه × ${fa(num(s.price))}`,c:'#444',s:17})}if(t.flat+(t.pros||0))L.push({t:fa(t.flat+(t.pros||0)),b:1})}
  else if(x.price==='items'){let sum=0;if(x.base){const bq=teethQty(s,x),u=num(s.price);if(bq&&u){sum+=bq*u;L.push({t:`جراحی: ${fa(bq)}×${fa(u)}`,c:'#444',s:17})}}x.items.forEach(it=>{if(regP(x,it)){RQD.forEach(q=>{const iq=itemQ(s,it,q),u=qPrice(s,it,q);if(iq&&u){sum+=iq*u;L.push({t:`${it.l} ${q}: ${fa(iq)}×${fa(u)}`,c:'#444',s:17})}});return}const iq=itemQty(s,it),u=num(s.ip[it.k]);if(iq&&u){sum+=iq*u;L.push({t:`${it.l}: ${fa(iq)}×${fa(u)}`,c:'#444',s:17})}});if(sum)L.push({t:fa(sum),b:1})}
  else{const rt0=rowTotals(r,x),t=rt0.brand;if(x.id==='imp'&&rt0.pros){L.push({t:`روکش: ${fa(q)}×${fa(num(r.s.crw.price))}`,c:'#444',s:16});L.push({t:`= ${fa(rt0.pros)}`,c:'#444',s:16})}if(x.prosJaw&&chipSel(s)&&num(s.price))L.push({t:`پروتز: ${fa(chipSel(s))} فک × ${fa(num(s.price))}`,c:'#444',s:17});if(q)L.push({t:`${fa(q)} ${x.price==='implantBrand'?'پایه':'واحد'}`,c:'#444',s:17});BRANDS.forEach(b=>{if(t[b.k])L.push({t:`${b.n}: ${fa(t[b.k])}`,b:b.k===r.brand,s:b.k===r.brand?19:17,c:b.k===r.brand?INK:'#555'})})}
  return L}

function sectionRow(r,x){const c=mctx(),s=r.s[x.id],sel=s.sel,pad=14,draws=[];let mh=0;const maxW=C.midW-2*pad;
  if(x.n){const n=x.n,jl=60,gap=12;const cw=Math.min(40,Math.floor((C.midW-2*pad-2*jl-gap)/(2*n))),ch=36;
    const gridW=cw*2*n+gap,gx=C.midL+(C.midW-gridW)/2;
    ['U','L'].forEach((j,ri)=>{const yo=ri*(ch+8);draws.push((cx,top)=>{const y=top+pad+yo;
      T(cx,j==='U'?'بالا':'پایین',C.midR-pad,y+ch/2,{s:18,w:700,c:'#333'});
      for(let i=0;i<n;i++){const k=n-i;tooth(cx,gx+i*cw,y,cw-4,ch,k,!!sel[j+'R'+k])}
      cx.fillStyle=INK;cx.fillRect(gx+n*cw+gap/2-3,y-3,2.5,ch+6);
      for(let i=0;i<n;i++){const k=i+1;tooth(cx,gx+n*cw+gap+i*cw,y,cw-4,ch,k,!!sel[j+'L'+k])}})});
    draws.push((cx,top)=>{const y=top+pad+ch+4;cx.fillStyle='#999';cx.fillRect(gx,y-0.5,gridW-4,1)});
    mh=2*ch+8;
    const capY=mh;draws.push((cx,top)=>{const y=top+pad+capY+13;T(cx,'راست بیمار',gx,y,{s:15,c:GREY,a:'left'});T(cx,'چپ بیمار',gx+gridW-4,y,{s:15,c:GREY,a:'right'})});mh+=28;
    if(x.kind==='teeth'&&x.groups)mh+=drawChipLines(draws,chipLine(c,[].concat(...chipItems(c,x.groups,(gi,o)=>!!sel[gi+':'+o])),maxW),mh);
    const notes=[];
    if(x.cnt==='jaws')[['U','فک بالا'],['L','فک پایین']].forEach(([j,l])=>{if(num(s.jc[j]))notes.push(`تعداد کل ${l}: ${fa(num(s.jc[j]))}`)});if(x.both&&num(s.cnt))notes.push(`مجموع دو فک: ${fa(num(s.cnt))}`);
    if(x.cnt==='jaw')[['U','فک بالا'],['L','فک پایین']].forEach(([j,l])=>{if(num(s.jc[j]))notes.push(`Full EXT ${l}: ${fa(num(s.jc[j]))} عدد`)});
    if(notes.length){const yy=mh;draws.push((cx,top)=>T(cx,notes.join('   ·   '),C.midR-pad,top+pad+yy+14,{s:19,w:800}));mh+=32}}
  if(x.id==='cbct'){const it=[{label:'نوع:',w:Wd(c,'نوع:',{w:700,s:19})+16},...['CBCT','CT scan'].map(o=>{const on=(o==='CT scan')===!!s.isel['m:ct'];return {text:o,on,w:28+Wd(c,o,{w:on?800:400,s:20})+26}})];
    [['z:1','CBCT زایگوما، تریگوئید و نازال'],['zs:1','CBCT ساب‌پریوستئال']].forEach(([zk,o])=>{if(s.isel[zk])it.push({text:o,on:true,w:28+Wd(c,o,{w:800,s:20})+26})});mh+=drawChipLines(draws,chipLine(c,it,maxW),mh);
    if(s.isel['m:ct']){const yy=mh;draws.push((cx,top)=>T(cx,CTTXT,C.midR-pad,top+pad+yy+15,{s:19,w:700}));mh+=30}}
  if(x.kind==='quad'){const cxm=(C.midL+C.midR)/2,bw=70,bh=34,yy=mh;
    draws.push((cx,top)=>{const y0=top+pad+yy,yc=y0+bh+4;cx.fillStyle=INK;cx.fillRect(cxm-1.5,y0,3,2*bh+8);cx.fillRect(cxm-2*bw,yc-1.5,4*bw,3);
      [['q1',-1,-1],['q2',1,-1],['q4',-1,1],['q3',1,1]].forEach(([k,dx,dy])=>{const on=!!sel[k],xc=cxm+dx*bw,ycc=yc+dy*(bh/2+2);
        checkbox(cx,xc+22,ycc,on);T(cx,'Q',xc-6,ycc,{s:22,w:on?800:400,c:on?INK:'#888',a:'center'})});
      T(cx,'راست بیمار',cxm-2*bw-10,yc,{s:15,c:GREY,a:'right'});T(cx,'چپ بیمار',cxm+2*bw+10,yc,{s:15,c:GREY,a:'left'})});
    mh+=2*bh+18}
  else if(x.kind==='chips'){mh+=drawChipLines(draws,[].concat(...chipItems(c,x.groups,(gi,o)=>!!sel[gi+':'+o]).map(g=>chipLine(c,g,maxW))),mh);
    if(x.price==='aox'){mh+=drawChipLines(draws,chipLine(c,chipItems(c,[{l:'نوع (ایتالیایی)',o:['کلاسیک','لانگ']}],(gi,o)=>(o==='لانگ')===!!s.isel['t:long'])[0],maxW),mh);
      if(s.isel['t:long']&&(s.ip.ln||'').trim())wrap(c,'توضیحات: '+s.ip.ln.trim(),maxW,{s:19}).forEach(ln=>{const yy=mh;draws.push((cx,top)=>T(cx,ln,C.midR-pad,top+pad+yy+15,{s:19}));mh+=30})}
    if(x.sgt){const th=Object.keys(sel).filter(k=>sel[k]&&isTooth(k));if(th.length)wrap(c,'محل پایه‌ها: '+toothTxt(th),maxW,{s:19,w:700}).forEach(ln=>{const yy=mh;draws.push((cx,top)=>T(cx,ln,C.midR-pad,top+pad+yy+15,{s:19,w:700}));mh+=30})}}
  else if(x.kind==='items'&&x.items.every(it=>it.type==='quad')){const bw=46,bh=30,yy=mh,n=x.items.length;
    x.items.forEach((it,ii)=>{const cxm=C.midR-(C.midW/n)*(ii+.5);draws.push((cx,top)=>{const y0=top+pad+yy;
      T(cx,it.l,cxm,y0+14,{s:19,w:800,a:'center'});const yt=y0+34,yc=yt+bh+4;cx.fillStyle=INK;cx.fillRect(cxm-1.5,yt,3,2*bh+8);cx.fillRect(cxm-2*bw,yc-1.5,4*bw,3);
      [['UR',-1,-1],['UL',1,-1],['LR',-1,1],['LL',1,1]].forEach(([q,dx,dy])=>{const on=!!s.isel[it.k+':'+q],xc=cxm+dx*bw,ycc=yc+dy*(bh/2+2);
        checkbox(cx,xc+32,ycc,on);const tt=on&&it.tn?tnTeeth(s,it,q).map(z=>fa(z.slice(2))).join(','):'';T(cx,q+(on&&it.qn?' ×'+fa(num(s.icnt[it.k+':'+q])||1):'')+(tt?' '+tt:''),xc-14,ycc,{s:tt?15:19,w:on?800:400,c:on?INK:'#888',a:'center'})})})});
    mh+=34+2*bh+16}
  else if(x.kind==='items'){const lines=[];x.items.forEach(it=>{
      if(it.type==='chips')lines.push(...chipLine(c,chipItems(c,[{l:it.l,o:it.o}],(gi,o)=>!!s.isel[it.k+':'+o])[0],maxW));
      else{const v=num(s.icnt[it.k]),tx=`${it.l}: ${v?fa(v)+' عدد':'—'}`;lines.push([{note:tx,w:Wd(c,tx,{s:19,w:700})+48}])}});
    mh+=drawChipLines(draws,lines,mh)}
  if(x.id==='imp'&&(s.sp||[]).length){(s.sp||[]).forEach(r=>{const t='مورد خاص — '+(r.k?(isTooth(r.k)?toothTxt([r.k]):QNAME[r.k]||r.k)+': ':'')+[r.b,r.d?'Ø'+r.d:'',r.l?'طول '+r.l:''].filter(Boolean).join('، ');
    wrap(c,t,maxW,{s:19,w:700}).forEach(ln=>{const yy=mh;draws.push((cx,top)=>T(cx,ln,C.midR-pad,top+pad+yy+15,{s:19,w:700}));mh+=30})})}
  if(x.text&&s.text){const lines=wrap(c,`${x.text}: ${s.text}`,maxW,{s:20,w:500});lines.forEach((ln,i)=>{const yy=mh+i*30;draws.push((cx,top)=>T(cx,ln,C.midR-pad,top+pad+yy+15,{s:20,w:500}))});mh+=lines.length*30}
  else if(x.kind==='none'){draws.push((cx,top)=>T(cx,'—',C.midR-pad,top+pad+15,{s:20,c:GREY}));mh+=30}
  const pl=priceLines(r,x),ph=pl.length*28;
  const lab=wrap(c,x.t,C.labW-2*pad,{s:21,w:800}),lh=lab.length*30+(x.pros?24:0);
  const h=Math.max(52,mh+2*pad,ph+2*pad,lh+2*pad);
  return {h,table:true,draw(cx,top){
    box(cx,C.L,top,C.R-C.L,h,null,RULE,1.2);cx.fillStyle=RULE;cx.fillRect(C.labL,top,1.2,h);cx.fillRect(C.priceR,top,1.2,h);
    const ly=top+h/2-(lh)/2;lab.forEach((ln,i)=>T(cx,ln,C.R-pad,ly+15+i*30,{s:21,w:800}));
    if(x.pros)T(cx,'(پارت پروتز)',C.R-pad,ly+lab.length*30+10,{s:15,c:GREY});
    draws.forEach(d=>d(cx,top));
    const py=top+h/2-ph/2;if(pl.length)pl.forEach((p,i)=>T(cx,p.t,C.priceR-pad,py+14+i*28,{s:p.s||20,w:p.b?800:400,c:p.c||INK}));
    else T(cx,'—',C.L+C.priceW/2,top+h/2,{s:20,c:'#bbb',a:'center'})}}}

/* perf2: PDF logo = login logo */const LOGO=new Image();LOGO.src=(document.querySelector('img.hero-logo')||{}).src||'';const logoReady=LOGO.decode?LOGO.decode().catch(()=>{}):Promise.resolve();
function drawLogo(cx,x,y,h){if(!LOGO.naturalWidth)return 0;const w=h*LOGO.naturalWidth/LOGO.naturalHeight;cx.drawImage(LOGO,x,y,w,h);return w}
function headerBlock(r,meta){return {h:340,draw(cx,top){
  const lw=drawLogo(cx,C.L,top-2,96);T(cx,SET.clinic||'',C.R,top+20,{s:22,w:800});T(cx,SET.doctor||'',C.L+(lw?lw+14:0),top+20,{s:20,w:700,a:'left'});
  T(cx,meta.title||'طرح درمان ایمپلنت',PW/2,top+70,{s:42,w:800,a:'center'});T(cx,'(مشخصات فردی بیمار)',PW/2,top+112,{s:20,c:'#444',a:'center'});
  const y0=top+140,rowH=50,colW=(C.R-C.L)/3;box(cx,C.L,y0,C.R-C.L,rowH*3,null,RULE,1.2);cx.fillStyle='#bbb';cx.fillRect(C.L,y0+rowH,C.R-C.L,1);cx.fillRect(C.L,y0+2*rowH,C.R-C.L,1);
  const f=[['نام و نام خانوادگی',r.h.name],['کد ملی',r.h.nid],['سن',r.h.age],['تاریخ مراجعه',r.h.date],['موبایل',r.h.phone],['نام پزشک',r.h.doc],['پذیرنده',r.h.asst],['شهر',r.h.city],['تماس جهت هماهنگی',SET.phone]];
  f.forEach(([k,v],i)=>{const col=i%3,row=Math.floor(i/3),xr=C.R-col*colW-14,y=y0+row*rowH+rowH/2;T(cx,k+':',xr,y,{s:17,c:'#555'});const kw=Wd(cx,k+':',{s:17});
    const val=faD(v||'—');let vs=22;while(Wd(cx,val,{s:vs,w:800})>colW-kw-36&&vs>14)vs--;T(cx,val,xr-kw-10,y,{s:vs,w:800})});
  T(cx,meta.dateLine||('تاریخ تأیید طرح: '+(meta.jalali||'')),C.R,top+316,{s:18,w:700,c:'#333'})}}}
function miniHeader(r,meta){return {h:60,draw(cx,top){const lw=drawLogo(cx,C.L,top,40);T(cx,(meta.title||'طرح درمان ایمپلنت')+' · '+(r.h.name||''),C.R,top+20,{s:22,w:800});T(cx,meta.dateLine||('تاریخ تأیید: '+(meta.jalali||'')),C.L+(lw?lw+10:0),top+20,{s:18,a:'left',c:'#444'})}}}
function tableHead(){return {h:46,draw(cx,top){box(cx,C.L,top,C.R-C.L,46,'#e6e6e6',RULE,1.2);cx.fillStyle=RULE;cx.fillRect(C.labL,top,1.2,46);cx.fillRect(C.priceR,top,1.2,46);
  T(cx,'شرح درمان',C.R-14,top+23,{s:19,w:800});T(cx,'شماره دندان / توضیحات',(C.midL+C.midR)/2,top+23,{s:19,w:800,a:'center'});T(cx,'قیمت (تومان)',C.L+C.priceW/2,top+23,{s:19,w:800,a:'center'})}}}
function totalsBlock(r,title){const T0=totals(r),eb=effBrand(r),rows=needBrand(r)?BRANDS.map(b=>({b,s:T0.surg[b.k],p:T0.pros,t:T0.surg[b.k]+T0.pros,c:cashFor(r,T0.surg[b.k],T0.pros)})):[{b:{k:r.brand,n:'جمع کل درمان'},s:T0.surg[eb],p:T0.pros,t:T0.surg[eb]+T0.pros,c:cashFor(r,T0.surg[eb],T0.pros)}];if(!needBrand(r)&&!title)title='جمع کل درمان';const rh=44,h=44+rh*(rows.length+1)+10;
  return {h,draw(cx,top){T(cx,title||'جمع کل درمان به تفکیک برند ایمپلنت',C.R,top+20,{s:23,w:800});const y0=top+44,cols=[C.R,C.R-250,C.R-470,C.R-690,C.R-900,C.L];
    box(cx,C.L,y0,C.R-C.L,rh,'#e6e6e6');['برند ایمپلنت','پارت جراحی','پارت پروتز','جمع کل','پیش‌پرداخت نقد'].forEach((t,i)=>T(cx,t,cols[i]-14,y0+rh/2,{s:18,w:800}));
    rows.forEach((x,i)=>{const y=y0+rh*(i+1),on=x.b.k===r.brand;if(on)box(cx,C.L,y,C.R-C.L,rh,FAINT);
      T(cx,x.b.n+(on?'  (انتخاب بیمار)':''),cols[0]-14,y+rh/2,{s:19,w:on?800:500});[x.s,x.p,x.t,x.c].forEach((v,j)=>T(cx,fa(v),cols[j+1]-14,y+rh/2,{s:j===2?21:19,w:j===2||on?800:400}))});
    box(cx,C.L,y0,C.R-C.L,rh*(rows.length+1),null,RULE,1.2);cols.slice(1,5).forEach(xx=>{cx.fillStyle='#bbb';cx.fillRect(xx,y0,1,rh*(rows.length+1))})}}}
function payBlock(r){const pt=payText(r),bn=(BRANDS.find(b=>b.k===r.brand)||{n:''}).n,L=[];
  if(pt.surg)L.push(`پارت جراحی${bn&&needBrand(r)?' ('+bn+')':''}: ${pt.surg}`);if(pt.pros)L.push(`پارت پروتز: ${pt.pros}`);if(!L.length)L.push('—');
  if(needBrand(r))L.push(`برای سایر برندها هم پیش‌پرداخت: ${fa(pctS(r))}٪ پارت جراحی + ${fa(pctP(r))}٪ پارت پروتز (ستون آخر جدول).`);
  {const d=payBlockDates(r);if(d)L.push(d)}
  return textBlock('شرایط پرداخت',L)}
function medBlock(r){const c=mctx(),L=medList(r.med),pad=14,maxW=C.R-C.L-2*pad,lines=[];
  (L.length?L:['مورد خاصی گزارش نشده است.']).forEach(t=>wrap(c,'• '+t,maxW,{s:19,w:L.length?700:400}).forEach(x=>lines.push(x)));
  const h=46+lines.length*30+pad;
  return {h:h+12,draw(cx,top){box(cx,C.L,top,C.R-C.L,40,'#e6e6e6',RULE,1.2);T(cx,'وضعیت عمومی بیمار',C.R-pad,top+20,{s:19,w:800});
    box(cx,C.L,top+40,C.R-C.L,h-40,null,RULE,1.2);lines.forEach((ln,i)=>T(cx,ln,C.R-pad,top+40+pad+12+i*30,{s:19,w:L.length?700:400,c:L.length?INK:'#555'}))}}}
function bigTitle(t){return {h:70,draw(cx,top){box(cx,C.L,top+10,C.R-C.L,50,'#e9e9e9');T(cx,t,PW/2,top+36,{s:28,w:800,a:'center'})}}}

function textBlock(title,lines,o={}){const c=mctx(),ws=[];lines.forEach(l=>wrap(c,l,C.R-C.L-20,{s:19}).forEach(x=>ws.push(x)));const h=(title?40:8)+ws.length*30+10;
  return {h,draw(cx,top){let y=top;if(title){T(cx,title,C.R,top+20,{s:21,w:800});y+=40}ws.forEach((l,i)=>T(cx,l,C.R-(o.indent||0),y+15+i*30,{s:19,c:o.c||INK}))}}}
function signBlock(sig){return {h:150,draw(cx,top){const w=(C.R-C.L-30)/2;[['امضای بیمار',C.R],['مهر و امضای کلینیک',C.R-w-30]].forEach(([t,xr],i)=>{box(cx,xr-w,top+20,w,110,null,'#999',1.2);T(cx,t,xr-14,top+42,{s:18,c:'#555'});if(!i&&sig){const ih=74,iw=Math.min(w-30,ih*sig.width/sig.height);cx.drawImage(sig,xr-w+14,top+50,iw,iw*sig.height/sig.width)}})}}}
function consentSign(r,sig,meta){return {h:200,draw(cx,top){T(cx,'نام و نام خانوادگی بیمار: '+(r.h.name||''),C.R,top+30,{s:20,w:700});T(cx,'تاریخ: '+(meta.jalali||''),C.L+200,top+30,{s:20,w:700,a:'left'});const w=420;box(cx,C.R-w,top+56,w,130,null,'#999',1.2);T(cx,'امضای بیمار',C.R-14,top+78,{s:18,c:'#555'});if(sig){const ih=96,iw=Math.min(w-30,ih*sig.width/sig.height);cx.drawImage(sig,C.R-w+14,top+86,iw,iw*sig.height/sig.width)}}}}

