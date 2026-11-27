/* ---------- m43a (owner, 2026-11-17): «موارد خاص» in the implant row are priced by their own brand — each special tooth × the tariff of its brand group
   (e.g. Root), the other implants × the tariff of the plan's brand. Before, the special rows were text only and every implant was priced with one brand.
   Only a special row on a tooth that is selected in the implant row and whose brand is known counts. The split is shown as «count × tariff» in the
   form and in the PDF. Plans that are already finally approved keep the price they were approved with. ---------- */
(function(){
const grpOf=b=>{b=String(b||'').trim();if(!b)return '';try{const C=SET.catalog||[];const c=C.find(c=>((c.b||'')+(c.sys?' '+c.sys:'')).trim()===b)||C.find(c=>c.b===b)||C.find(c=>c.b&&b.toLowerCase().startsWith(String(c.b).toLowerCase()+' '));if(c&&c.g)return c.g}catch(e){}
  return /root|روت/i.test(b)?'rt':/jd/i.test(b)?'it':/avita|اویتا|آویتا/i.test(b)?'ir':/stra?uman|اشترومن|استرومن/i.test(b)?'sw':''};
const GN=g=>{const b=BRANDS.find(x=>x.k===g);return b?b.n:g};
/* {n, by:{group:count}, sum} for the special rows that change the price */
function mix(s){const o={n:0,by:{},sum:0};try{if(!s||!s.ip||!s.ip.m43)return o;const seen={};(s.sp||[]).forEach(r=>{if(!r||!r.k||!isTooth(r.k)||!s.sel||!s.sel[r.k]||seen[r.k])return;const g=grpOf(r.b);if(!g||!num(s.bp[g]))return;seen[r.k]=1;o.n++;o.by[g]=(o.by[g]||0)+1;o.sum+=num(s.bp[g])})}catch(e){}return o}
/* which plans use the new rule: every new form and every plan that is not finally approved yet; an approved plan keeps the price it was approved with
   (the mark travels with the plan in imp.ip.m43) */
{const _b=blankSections;blankSections=function(){const S=_b.apply(this,arguments);try{S.imp.ip.m43='1'}catch(e){}return S}}
{const _f=secFrom;secFrom=function(d){const S=_f.apply(this,arguments);try{S.imp.ip.m43=(d&&d.imp&&d.imp.ip&&d.imp.ip.m43)?'1':''}catch(e){}return S}}
{const _d=fromDoc;fromDoc=function(id,d){const r=_d.apply(this,arguments);try{if(r&&r.status!=='confirmed'&&r.status!=='modified'){if(r.s&&r.s.imp)r.s.imp.ip.m43='1';if(r.s2&&r.s2.imp&&r.s2.imp.ip)r.s2.imp.ip.m43='1'}}catch(e){}return r}}
const parts=(s,M)=>Object.keys(M.by).map(g=>`${GN(g)} ${fa(M.by[g])} × ${fa(num(s.bp[g]))}`);
{const _r=rowTotals;rowTotals=function(r,x){const o=_r.apply(this,arguments);try{if(x&&x.id==='imp'&&x.price==='brandUnit'&&r&&r.s&&r.s.imp){const s=r.s.imp,M=mix(s);
    if(M.n){BRANDS.forEach(b=>{o.brand[b.k]+=M.sum-M.n*num(s.bp[b.k])});o.m43={n:M.n,by:M.by,sum:M.sum}}}}catch(e){console.error('m43a',e)}return o}}
/* the form: «count × tariff» per brand with the special ones apart */
{const _c=pl9Calc;pl9Calc=function(){const out=_c.apply(this,arguments);try{const el=document.getElementById('calc_imp');if(el&&typeof AS==='function'){const S=AS(),s=S&&S.imp,M=s?mix(s):{n:0};
    if(M.n){const pv={s:S,brand:F.brand,pay:F.pay},x=SEC.imp,q=qty(s,x),rt=rowTotals(pv,x),sp=parts(s,M).join(' + ');
      el.innerHTML='<span class="pl9bl">'+BRANDS.map(b=>`<span>${b.n}: <bdi class="pl9m" dir="ltr">${fa(Math.max(0,q-M.n))} × ${fa(num(s.bp[b.k]))}</bdi> + خاص = <b>${fa(rt.brand[b.k])}</b></span>`).join('')+'</span>'+
        `<br><span class="m43sp">موارد خاص با تعرفه‌ی برند خودشان: <bdi dir="ltr">${esc(sp)}</bdi> = <b>${fa(M.sum)}</b></span>`+(rt.pros?`<br>روکش روی پایه‌ها (پارت پروتز): <bdi class="pl9m" dir="ltr">${fa(q)} × ${fa(num(S.crw.price))}</bdi> = <b>${fa(rt.pros)}</b>`:'')}}}catch(e){console.error('m43a calc',e)}return out}}
/* the PDF price column */
{const _p=priceLines;priceLines=function(r,x){let L=_p.apply(this,arguments);try{if(x&&x.id==='imp'&&Array.isArray(L)&&r&&r.s&&r.s.imp){const s=r.s.imp,M=mix(s);if(M.n){const q=qty(s,x),rt=rowTotals(r,x),LRM='‎';let last=-1;
    L=L.map((o,i)=>{const b=BRANDS.find(b=>typeof o.t==='string'&&o.t.startsWith(b.n+': '));if(!b)return o;last=i;return Object.assign({},o,{t:`${b.n}: ${LRM}${fa(Math.max(0,q-M.n))} × ${fa(num(s.bp[b.k]))} + خاص = ${fa(rt.brand[b.k])}`})});
    if(last>=0){const add=parts(s,M).map(t=>({t:'خاص: '+LRM+t,c:'#444',s:16}));L.splice(last+1,0,...add);
      try{const c=mctx(),W=C.priceW-28;L.forEach(o=>{let z=o.s||20;while(z>10&&Wd(c,o.t,{s:z,w:o.b?800:400})>W)z--;o.s=z})}catch(e){}}}}}catch(e){console.error('m43a pdf',e)}return L}}
window.m43a={mix,grpOf};
})();
