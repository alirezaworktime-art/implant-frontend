/* ---------- q4: «فقط ایمپلنت» (reception tick): the doctor/consultant form hides the prosthesis sections (روکش، روکش موقت، پروتز All on X / ساب‌پریوستئال) and the consultant's prosthesis cash/cheque fields; only the surgery part is calculated (pl11 already zeroes the prosthesis part). ---------- */
function q4Apply(){try{if(typeof F==='undefined'||!F||!F.h||(typeof SURG!=='undefined'&&SURG))return;const io=!!F.h.iOnly;
  ['crw','tmp'].forEach(id=>{const c=document.querySelector('[data-sec="'+id+'"]');if(c)c.classList.toggle('q4hide',io)});
  ['pr_aox','pr_sub'].forEach(id=>{const e=$(id),l=e&&e.closest('label');if(l)l.classList.toggle('q4hide',io)});
  const cp=$('p_cp');if(cp){const f=cp.closest('.fields'),g=f&&f.previousElementSibling;[f,(g&&g.classList.contains('grp'))?g:null,$('payPros')].forEach(e=>{if(e)e.classList.toggle('q4hide',io)})}
  const h=$('pl11Tag');if(h&&io)h.textContent='فقط ایمپلنت — پروتز در جای دیگر انجام می‌شود؛ بخش‌های پروتز و نقد/چک پروتز در این طرح خاموش است.'}catch(e){}}
{const _r=renderForm;renderForm=function(){const r=_r.apply(this,arguments);q4Apply();return r}}
{const _s=reSec;reSec=function(){const r=_s.apply(this,arguments);q4Apply();return r}}
{const _c=recalc;recalc=function(){const r=_c.apply(this,arguments);q4Apply();return r}}
