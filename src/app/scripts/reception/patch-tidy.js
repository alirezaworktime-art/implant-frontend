/* ---------- patch-tidy: هر بیمار فقط در یک جا دیده می‌شود ---------- */
const staffOwn=x=>{const q=x.queue||'',td=tDay();
  if((q==='surgdone'||q==='surgpart')&&x.sg&&x.sg.lastDay&&dDiff(td,x.sg.lastDay)<=7&&!x.sg.dis)return true;
  if(q==='done'&&(typeof TASKS!=='undefined'?TASKS:[]).some(t=>t.plan===x.id&&t.kind==='book'&&!t.done))return true;
  if(q==='waiting'&&x.queuedAt&&Date.now()-Date.parse(x.queuedAt)<15*60000)return true;
  return false};

const APPT_K_OK=['visit','postop','surg','uncover','impr','tryin','deliv','suture','check','other','tooth','soft','rscr','rabt','chks','chkp'];
