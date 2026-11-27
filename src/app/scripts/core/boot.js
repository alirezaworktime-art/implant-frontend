/* ---------- boot ---------- */
try{const s=JSON.parse(localStorage.getItem('implantPlanSettings')||'null');if(s)SET={...DEFAULT_SET,...s}}catch(e){}
try{$('lgClinic').textContent=SET.clinic||''}catch(e){}
renderForm();
if((API.url||IN_GAS||FS_ON)&&API.pw&&API.role&&(!FS_ON||API.t)){ROLE=API.role;applyRole();home();startPoll();processOutbox();
  api('ping').then(j=>{if(j.role!==ROLE){ROLE=j.role;API.role=ROLE;saveApi();applyRole();home()}USERNAME=j.user||'';applySettings(j.settings);applyQueue(j.queue);if(j.sender)$('cFrom').textContent=j.sender}).catch(()=>{})}
else if((API.url||IN_GAS||FS_ON)&&API.pw){api('ping').then(j=>{ROLE=j.role;API.role=ROLE;saveApi();applySettings(j.settings);if(j.sender)$('cFrom').textContent=j.sender;applyRole();home();startPoll();processOutbox()}).catch(err=>{logout();$('lgMsg').className='msg err';$('lgMsg').textContent=err.message})}
else logout();

