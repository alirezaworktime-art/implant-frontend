/* ---------- clicks ---------- */
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(!t)return;
  if(t.dataset.l2open){l2Open(t.dataset.l2open);return}
  if(t.dataset.l2start){l2StartOpen(t.dataset.l2start);return}
  if(t.dataset.l2send){l2Send(t.dataset.l2send,t);return}
  if(t.dataset.l2step){l2StepAct(t);return}
  if(t.dataset.l2prt){l2Print(t.dataset.l2prt);return}
  if(t.dataset.l2lbl){l2Label(t.dataset.l2lbl);return}
  if(t.dataset.l2v3){l2View3(t.dataset.l2v3);return}
  if(t.dataset.l2dl){l2Dl(t.dataset.l2dl,t);return}
  if(t.dataset.l2img){l2Img(t.dataset.l2img);return}
  if(t.dataset.l2fdel){if(t.dataset.armed!=='1'){t.dataset.armed='1';t.textContent='حذف شود؟ دوباره بزنید';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.textContent='حذف'}},4000);return}
    t.disabled=true;api('labFile',{op:'del',fid:t.dataset.l2fdel}).then(()=>{toast('فایل حذف شد.');if(L2.ord&&L2.ord.order)l2Load(L2.ord.order.id,true)}).catch(err=>{alertMsg(err.message);t.disabled=false});return}
  if(t.dataset.l2dept!==undefined){L2.dept=Number(t.dataset.l2dept)||0;renderLab();return}
  if(t.dataset.l2ds){L2.dseg=t.dataset.l2ds;const L=ROLE==='lab'?$('lbList'):$('l2DefIn');if(L)l2DefsView(L);return}
  if(t.dataset.l2de){l2DefEdit(t.dataset.l2de,t.dataset.id);return}
  if(t.id==='l2colSave'){t.disabled=true;api('labDefs',{op:'colors',x:{colors:$('l2cols').value.split(/[,،\n]/).map(s=>s.trim()).filter(Boolean)}}).then(()=>{toast('ذخیره شد.');return l2Defs(true)}).catch(err=>alertMsg(err.message)).finally(()=>t.disabled=false);return}
  if(t.id==='l2rGo'){L2.retF={from:$('l2rf').value.trim(),to:$('l2rt').value.trim()};l2RetView($('lbList'));return}},true);
document.addEventListener('change',e=>{if(e.target&&e.target.id==='l2All'){L2.all=e.target.checked;renderLab()}});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='l2Q'){L2.q=e.target.value;clearTimeout(L2.qt);L2.qt=setTimeout(()=>{const p=e.target.selectionStart;renderLab();const i=$('l2Q');if(i){i.focus();try{i.setSelectionRange(p,p)}catch(x){}}},250)}});

