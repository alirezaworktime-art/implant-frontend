
/* ---------- m30 (owner, 2026-11-14, test of the published version): (1) the lab «بررسی وضعیت» answer is information, not an error — shown as a normal toast; (2) the patient file of a
   paper file says which sub-stage («معاینه» / «پیگیری») the patient is waiting for and when, and the months of «کاشت مجدد» ---------- */
{const _a=alertMsg;alertMsg=function(t){try{const f=$('viewForm');if((!f||f.hidden||f.offsetParent===null)&&/^#/.test(String(t||''))){toast(String(t));return}}catch(e){}return _a.apply(this,arguments)}}
{const _i=fxArcInfo;fxArcInfo=function(id,j){let h=_i.apply(this,arguments);try{const a=((j||{}).data||{}).arc||{},sb=a.sub,X=[];
  if(sb&&M29_SUB[sb.k])X.push('مرحله‌ی بعد (فرعی): '+M29_SUB[sb.k]+' — '+jDay(sb.due));
  (a.lines||[]).forEach(l=>{if(l&&l.k==='ifail'&&l.rm)X.push('فیلد شدن ایمپلنت '+toothTxt(l.teeth||[])+': کاشت مجدد '+fa(l.rm)+' ماه بعد'+(l.rmDue?' ('+jDay(l.rmDue)+')':''))});
  if(X.length&&typeof h==='string'){const i=h.indexOf('<table');const box=`<div class="m30sub">${X.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;h=i>=0?h.slice(0,i)+box+h.slice(i):h+box}}catch(e){}return h}}
