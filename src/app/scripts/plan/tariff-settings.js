/* ---------- tariff settings ---------- */
const unitLbl=x=>x.ul?' · '+x.ul:(x.price==='unit'||x.price==='brandUnit'?' · هر واحد':'');
function renderPriceSettings(){const P=SET.prices||{};const inp=(k,v,b)=>`<input class="price" inputmode="numeric" data-tp="${k}" ${b?`data-tb="${b}"`:''} value="${esc(fmtInput(v))}">`;
  $('set_prices').innerHTML=SECTIONS.filter(x=>x.price&&(x.price!=='implantBrand'||x.prosJaw)).map(x=>{const t=P[x.id]||{},bp=t.bp||{};
    if(x.price==='aox'){const ib=((P.imp||{}).bp||{}).it;return `<div class="grp"><span>All on X کلاسیک · پروتز هر پایه</span>${inp(x.id,t.price||x.def)}</div>`+x.xp.map(it=>`<div class="grp"><span>${it.l}</span>${inp(it.pk,(P[it.pk]||{}).price||it.def||ib)}</div>`).join('')}
    if(x.prosJaw)return `<div class="grp"><span>${x.t} · پروتز هر فک</span>${inp(x.id,t.price||x.def)}</div>`;
    if(x.price==='items')return (x.base?`<div class="grp"><span>${x.t} · قیمت جراحی هر واحد</span>${inp(x.id,t.price||x.def)}</div>`:'')+x.items.map(it=>`<div class="grp"><span>${x.t===it.l?'':x.t+' · '}${it.l} · ${it.ul||(it.type==='chips'?'هر طرف':'هر واحد')}</span>${inp(it.pk,(P[it.pk]||{}).price||it.def)}</div>`).join('');
    const extra=(x.items||[]).map(it=>`<div class="grp"><span>${it.l}</span>${inp(it.pk,(P[it.pk]||{}).price)}</div>`).join('');
    if(x.items)return `<div class="grp"><span>${x.t}${unitLbl(x)}</span>${inp(x.id,t.price)}</div>`+extra;
    const inner=x.price==='brandUnit'?`<div class="brands">${BRANDS.map(b=>`<label class="f">${b.n}${inp(x.id,bp[b.k]||(x.id==='imp'&&b.k==='rt'?'21000000':''),b.k)}</label>`).join('')}</div>`:inp(x.id,t.price);
    return `<div class="grp"><span>${x.t}${unitLbl(x)}${x.pros?' (پروتز)':''}</span>${inner}</div>`}).join('')+'<p class="note">اوردنچر از تعرفه‌ی «پایه ایمپلنت» هر برند حساب می‌شود.</p>'}
function readPriceSettings(){const P={};document.querySelectorAll('#set_prices [data-tp]').forEach(i=>{const id=i.dataset.tp;P[id]=P[id]||{price:'',bp:{}};
  if(i.dataset.tb)P[id].bp[i.dataset.tb]=String(num(i.value)||'');else P[id].price=String(num(i.value)||'')});return P}

