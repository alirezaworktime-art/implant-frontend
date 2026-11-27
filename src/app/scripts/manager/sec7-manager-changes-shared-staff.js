/* ---------- sec7: manager changes the shared staff / doctor / consultant passwords from «کاربران» (the old password stops working) ---------- */
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('[data-rolepw]');if(!t)return;const f=t.dataset.rolepw,i=$(t.dataset.rpin),m=$('uaRoleMsg'),v=i?i.value:'',L={staffPw:'منشی',docPw:'پزشک',consPw:'مشاور',surgPw:'دستیار جراحی',invPw:'انباردار',labPw:'لابراتوار',ocPw:'سایر کلینیک‌ها'}[f]||'';
  if(v.length<8){m.className='msg err';m.textContent=`رمز ${L} حداقل ۸ حرف باشد.`;return}
  t.disabled=true;try{await api('settings',{settings:{[f]:v}});i.value='';m.className='msg ok';m.textContent=`رمز مشترک ${L} عوض شد؛ رمز قبلی ${L} از همین حالا کار نمی‌کند.`}catch(err){m.className='msg err';m.textContent=err.message}finally{t.disabled=false}},true);

