/* ---------- fix5: manager changes the shared manager password from «کاربران» ---------- */
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('#uaMgrPw');if(!t)return;const m=$('uaMgrMsg'),v=$('ua_mgrpw').value;
  if(v.length<8){m.className='msg err';m.textContent='رمز مدیر حداقل ۸ حرف باشد.';return}
  t.disabled=true;try{await api('settings',{settings:{mgrPw:v}});$('ua_mgrpw').value='';m.className='msg ok';m.textContent='رمز مشترک مدیر عوض شد. از این به بعد با رمز تازه وارد شوید.'}catch(err){m.className='msg err';m.textContent=err.message}finally{t.disabled=false}},true);

