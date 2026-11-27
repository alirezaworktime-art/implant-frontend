
/* ---------- arc12: re-implant (paper files) picks tooth + brand + diameter + length in the same window as «پایه ایمپلنت»; price stays typed by the clinic ---------- */
{const _l=a6Line;a6Line=function(l){let h=_l.apply(this,arguments);if(!l||l.k!=='reimp')return h;try{
  h=h.replace(/<label class="f">برند<input data-a6f="b"[^>]*><\/label>/,'');
  h=h.replace(/<div class="a6dl">[\s\S]*?<\/span><\/div>/,'');
  const miss=arbMiss(l);
  const chips=l.teeth.length?`<div class="arbl">${l.teeth.map(t=>{const m=(l.imp||{})[t]||{},ok=m.b&&m.d&&m.l;return `<button type="button" class="arbc${ok?'':' bad'}" data-arbt="${t}" data-l="${l.id}"><b>${esc(toothTxt([t]))}</b> ${ok?esc(m.b)+' · '+faD(String(m.d))+'×'+faD(String(m.l)):'برند و سایز را بزنید'}</button>`}).join('')}</div>`:'';
  h=h.replace('<div class="a6sut">',`${chips}${miss.length&&l.teeth.length?'<p class="note arbm">برای '+fa(miss.length)+' دندان برند و سایز ثبت نشده؛ روی آن بزنید.</p>':''}<div class="a6sut">`);
  h=h.replace('دندان‌ها را بزنید','روی دندانی که دوباره کاشته شده بزنید و برند و سایزش را انتخاب کنید')}catch(e){}return h}}
window.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('button');if(!t||!A6)return;const d=t.dataset;
  if(!(d.a6t||d.arbt))return;const l=a6L(d.l);if(!l||l.k!=='reimp')return;e.preventDefault();e.stopImmediatePropagation();arbOpen(l,d.a6t||d.arbt)},true);
/* save: every re-implanted tooth needs brand and size */
{const _s=a6Save;a6Save=async function(btn){try{for(const l of (A6&&A6.lines||[])){if(l.k!=='reimp')continue;const miss=arbMiss(l);if(miss.length){const m=$('a6Msg');m.className='msg err';m.textContent='ایمپلنت مجدد: برای دندان '+toothTxt(miss)+' برند، قطر و طول را انتخاب کنید (روی دندان بزنید).';const n=document.querySelector(`[data-arbt="${miss[0]}"][data-l="${l.id}"]`);if(n)n.scrollIntoView({behavior:'smooth',block:'center'});return}}}catch(e){}return _s.apply(this,arguments)}}
/* each tooth keeps its own brand on the way to the server */
{const _a=api;api=function(action,payload,opt){try{if(action==='fxArc'&&payload&&payload.arc&&payload.arc.v6&&A6)(payload.arc.lines||[]).forEach(x=>{if(x.k!=='reimp')return;const l=A6.lines.find(y=>y.id===x.id);if(!l)return;
  x.imp=Object.fromEntries((l.teeth||[]).map(t=>{const m=(l.imp||{})[t]||{};return [t,{b:m.b||l.b||'',d:m.d||'',l:m.l||''}]}));const b0=Object.values(x.imp).map(m=>m.b).find(Boolean);if(b0){x.b=b0;l.b=b0}})}catch(e){}return _a.apply(this,arguments)}}
