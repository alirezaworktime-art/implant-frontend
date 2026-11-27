<script>/* ---------- dep1 (owner, 2026-11-26): editing a confirmed plan also corrects the recorded deposit (بیعانه); the re-downloaded patient PDF and the debt follow ---------- */
{const _fzDep=finalize;finalize=async function(t){
  try{const ed=CF_ON&&F&&F.id&&(F.status==='confirmed'||F.status==='modified')&&['consultant','manager','staff'].includes(ROLE)&&F.pay&&String(F.pay.rcv==null?'':F.pay.rcv).trim()!=='';
    if(ed){const g=await api('get',{id:F.id},{timeout:10000});const prev=num(((g&&g.data&&g.data.pay)||{}).rcv),now=num(F.pay.rcv);
      if(prev!==now){const p=F.pay,via=p.mt==='cash'?'cash':p.mt==='xfer'?'xfer':(p.pos||'');
        if(now>prev&&!via){alertMsg('روش دریافت بیعانه (اسکناس / کارتخوان / واریز) را انتخاب کنید.');return}
        const q=await api('depEdit',{id:F.id,amount:now,pay:{kind:posKind(via||'cash'),pos:posId(via||'cash'),acct:via==='xfer'?p.acct||'':'',by:ROLE_LBL[ROLE]},sendId:uuid()});
        if(!q||q.ok===false){alertMsg('بیعانه اصلاح نشد: '+((q&&q.error)||'خطای نامعلوم'));return}
        try{const g2=await api('get',{id:F.id});if(g2&&Array.isArray(g2.pays))F.pays=g2.pays}catch(e){}
        if(!q.same)toast('بیعانه از '+fa(q.from)+' به '+fa(q.to)+' تومان اصلاح شد.')}}}
  catch(e){alertMsg('اصلاح بیعانه: '+(e&&e.message||e));return}
  return _fzDep.apply(this,arguments)}}
</script>
