/* ---------- m46b (owner, 2026-11-17): reception — the «طرح درمان بیمار» sheet (which plan did the patient choose?) now shows what every plan
   contains: its treatments with the tooth chart, the same summary the surgeon sees, under each plan's name. Before, only the cost stood there. ---------- */
(function(){
{const _q=q7PlanSheet;q7PlanSheet=function(snap){const r=_q.apply(this,arguments);try{const s=$('q7PlSh');if(s&&snap&&!s.querySelector('.m46bw')){
    const all=[{no:1,s:snap.s}].concat(((snap.sx&&snap.sx.length)?snap.sx:(snap.s2?[snap.s2]:[])).map((x,i)=>({no:i+2,s:x})));
    const h='<div class="m46bw"><p class="note">جزئیات هر طرح (برای انتخاب، دکمه‌ی همان طرح را در بالا بزنید):</p>'+all.map(p=>`<details class="m46bd" open><summary>طرح ${fa(p.no)}</summary><div class="pview">${planViewHTML(p.s)}</div></details>`).join('')+'</div>';
    const m=s.querySelector('#q7PlMsg');if(m)m.insertAdjacentHTML('beforebegin',h);const inn=s.querySelector('.in');if(inn)inn.classList.add('m46bin')}}catch(e){console.error('m46b',e)}return r}}
})();
