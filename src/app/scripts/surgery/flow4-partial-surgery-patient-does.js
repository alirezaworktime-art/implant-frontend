/* ---------- flow4: partial surgery — patient does not continue ---------- */
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('button[data-surgstop]');if(!t)return;
  if(!arm2(t,'جراحی بسته شود؟ دوباره بزنید'))return;t.disabled=true;
  try{const j=await api('surgStop',{id:t.dataset.surgstop,by:($('rc_asst')||{}).value||ROLE_LBL[ROLE]||''});toast(j.settle==='pending'?'جراحی بسته شد؛ تسویه‌ی اختلاف هزینه را تعیین تکلیف کنید.':'جراحی بسته شد.');pollQ(true)}catch(err){toast(err.message,1);t.disabled=false}},true);

