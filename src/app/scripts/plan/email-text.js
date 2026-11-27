/* ---------- email text ---------- */
function brandLines(r,label){const T0=totals(r),out=[label];
  BRANDS.forEach(b=>out.push(`  ${b.n}${b.k===r.brand?' (انتخاب بیمار)':''}: جمع ${fa(T0.surg[b.k]+T0.pros)} تومان · پیش‌پرداخت نقد ${fa(cashFor(r,T0.surg[b.k],T0.pros))}`));return out}
function summaryText(r){const out=[];
  out.push(`طرح درمان ایمپلنت بیمار: ${r.h.name||'—'}`);if(r.h.nid)out.push('کد ملی: '+r.h.nid);out.push('تاریخ تأیید: '+(r.jalali||''));
  if(r.h.doc)out.push('پزشک: '+r.h.doc);if(r.h.asst)out.push('دستیار: '+r.h.asst);out.push('');
  out.push(...brandLines(PV(r,1),r.alt.mode!=='none'?'طرح اول، هزینه به تفکیک برند ایمپلنت:':'هزینه به تفکیک برند ایمپلنت:'));
  if(r.alt.mode==='full'&&(r.sx||r.s2)){(r.sx||[r.s2]).forEach((sx,i)=>{out.push('');out.push(...brandLines(PV(r,i+2),'طرح '+fa(i+2)+'، هزینه به تفکیک برند ایمپلنت:'))})}
  else if(r.alt.mode==='text'&&(r.alt.text||'').trim()){out.push('');out.push('طرح درمان پیشنهادی دوم:');out.push(r.alt.text)}
  out.push('');out.push('فایل PDF کامل طرح درمان پیوست است.');return out.join('\n')}
const mailFor=r=>({subject:`طرح درمان ایمپلنت - ${r.h.name} - ${r.jalali}`+((r.edits||0)>0?' (ویرایش شده)':''),body:summaryText(r)});

