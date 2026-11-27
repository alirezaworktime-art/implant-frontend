/* ---------- archive filters ---------- */
let LFILT='all';
const statusKey=d=>d.queue==='undecided'?'und':d.queue==='lost'?'lost':d.settle==='pending'?'settle':d.queue==='surgery'?'surg':d.queue==='surgdone'?'sdone':(d.status==='queued'||['waiting','reviewing','consult','consulting'].includes(d.queue))?'wait':d.status==='draft'?'draft':'conf';
const FILTS=[['all','همه'],['wait','در انتظار'],['conf','تأییدشده'],['surg','در جراحی'],['sdone','جراحی‌شده'],['settle','منتظر تسویه'],['und','تصمیم‌نگرفته'],['lost','انصراف'],['draft','پیش‌نویس']];
function renderFilt(){const el=$('lFilt');if(!el)return;const n={};ARCHIVE.forEach(d=>{const k=statusKey(d);n[k]=(n[k]||0)+1});n.all=ARCHIVE.length;
  el.innerHTML=FILTS.filter(([k])=>k==='all'||n[k]).map(([k,l])=>`<button type="button" class="chip" data-lfilt="${k}" aria-pressed="${LFILT===k}">${l} <span class="cnt">${fa(n[k]||0)}</span></button>`).join('')}

