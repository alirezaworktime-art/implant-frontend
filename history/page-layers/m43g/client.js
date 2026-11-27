/* ---------- m43g (owner, 2026-11-17): the patient file shows the implant cost split by brand — «count × tariff» for every brand group — in «سیر درمان»:
   under «تأیید طرح درمان» (the plan: plan brand + the special teeth of other brands) and under every surgery session (the fixtures that were really
   placed). Before, only one brand name stood beside the total. Only for the roles that see prices. The totals themselves are not changed. ---------- */
(function(){
const GN=g=>{const b=BRANDS.find(x=>x.k===g);return b?b.n:g};
const canSee=()=>['consultant','staff','manager','accountant'].includes(ROLE);
const txt=G=>{const K=Object.keys(G).filter(g=>G[g].n>0).sort((a,b)=>BRANDS.findIndex(x=>x.k===a)-BRANDS.findIndex(x=>x.k===b));if(!K.length)return '';const sum=K.reduce((a,g)=>a+G[g].n*G[g].p,0);
  return K.map(g=>`${GN(g)} ${fa(G[g].n)} × ${fa(G[g].p)}`).join(' + ')+(K.length>1?' = '+fa(sum):'')};
function planSplit(r){try{const s=r&&r.s&&r.s.imp;if(!s||!r.brand||r.brand==='ref')return null;const q=qty(s,SEC.imp);if(!q)return null;const b=effBrand(r),M=(window.m43a&&window.m43a.mix(s))||{n:0,by:{}},G={};
  if(q-M.n>0)G[b]={n:q-M.n,p:num(s.bp[b])};Object.keys(M.by||{}).forEach(g=>{G[g]=G[g]||{n:0,p:num(s.bp[g])};G[g].n+=M.by[g]});return G}catch(e){return null}}
function sesSplit(r,ss){try{const b=effBrand(r),P=r.s,S=secFrom(ss.s||{}),im=ss.imp||{},G={};let redo=0;
  Object.keys(S.imp.sel).filter(k=>S.imp.sel[k]&&isTooth(k)).forEach(k=>{const m=im[k]||{};if(m.rs==='redo'){redo++;return}const g=m.g&&num(P.imp.bp[m.g])?m.g:b;G[g]=G[g]||{n:0,p:num(P.imp.bp[g])};G[g].n++});
  const jc=['U','L'].reduce((a,j)=>a+num(S.imp.jc[j]),0);if(jc){G[b]=G[b]||{n:0,p:num(P.imp.bp[b])};G[b].n+=jc}return {G,redo}}catch(e){return null}}
{const _r=renderFile;renderFile=function(){const out=_r.apply(this,arguments);try{if(PF&&PF.j&&(PF.tab||'tl')==='tl'&&canSee()&&!((PF.j.surg||{}).arc)){const j=PF.j,r=fromDoc(PF.id,j.data||{}),box=document.querySelector('#pfBody .tl');
    if(box){const items=[...box.querySelectorAll('.tl-i')],find=t=>items.find(x=>{const b=x.querySelector('b');return b&&b.textContent.trim()===t}),add=(el,label,t)=>{if(el&&t&&!el.querySelector('.m43g'))el.querySelector('div').insertAdjacentHTML('beforeend',`<p class="m43g">${esc(label)}: <bdi dir="ltr">${esc(t)}</bdi></p>`)};
      const G=planSplit(r);if(G)add(find('تأیید طرح درمان'),'ایمپلنت در طرح به تفکیک برند',txt(G));
      ((j.surg||{}).sessions||[]).forEach(ss=>{const o=sesSplit(r,ss);if(!o)return;const t=txt(o.G);add(find(`جلسه‌ی ${fa(ss.n||0)} جراحی`),'ایمپلنت‌های کاشته‌شده به تفکیک برند',t+(o.redo?(t?' · ':'')+`کاشت مجدد ${fa(o.redo)} (رایگان)`:''))})}}}catch(e){console.error('m43g',e)}return out}}
/* the text the consultant gives the patient */
{const _p=patientSummary;patientSummary=function(){let t=_p.apply(this,arguments);try{const G=planSplit(F);if(G&&Object.keys(G).filter(g=>G[g].n>0).length>1){const L=t.split('\n'),i=L.findIndex(x=>x.startsWith('جمع کل'));if(i>=0){L.splice(i,0,'ایمپلنت به تفکیک برند: '+txt(G));t=L.join('\n')}}}catch(e){}return t}}
window.m43g={planSplit,sesSplit,txt};
})();
