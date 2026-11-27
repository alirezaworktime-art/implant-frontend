/* ---------- extras: theme, patient file, archive filters, reception helpers, overview strip, patient summary ---------- */
/* theme: auto → light → dark */
const THEMES=['auto','light','dark'],THEME_LBL={auto:'خودکار',light:'روشن',dark:'تیره'};
function applyTheme(t){if(t==='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;const b=$('themeBtn');if(b){b.title='حالت نمایش: '+THEME_LBL[t];b.dataset.t=t}}
function nextTheme(){let t='auto';try{t=localStorage.getItem('implantTheme')||'auto'}catch(e){}const n=THEMES[(THEMES.indexOf(t)+1)%3];try{localStorage.setItem('implantTheme',n)}catch(e){}applyTheme(n);toast('حالت نمایش: '+THEME_LBL[n])}
try{applyTheme(localStorage.getItem('implantTheme')||'auto')}catch(e){}

/* dates */
const jt=iso=>{if(!iso)return '';try{const d=new Date(iso);return jalali(d).slash+' '+d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
const jd=iso=>{if(!iso)return '';try{return jalali(new Date(iso)).slash}catch(e){return ''}};
/* phone helpers for WhatsApp / SMS */
const intlPhone=p=>{let d=toEn(p||'').replace(/\D/g,'');if(d.startsWith('0098'))d=d.slice(4);else if(d.startsWith('98')&&d.length===12)d=d;else if(d.startsWith('0'))d='98'+d.slice(1);else if(d.length===10)d='98'+d;return d.length===12?d:''};
const waLink=(p,t)=>{const n=intlPhone(p);return n?`https://wa.me/${n}?text=${encodeURIComponent(t||'')}`:''};
const smsLink=(p,t)=>{const n=intlPhone(p);return n?`sms:+${n}?body=${encodeURIComponent(t||'')}`:''};
const msgFor=(kind,name)=>{const c=SET.clinic||'کلینیک';const n=name?name+' عزیز':'بیمار عزیز';return {numb:`${n}، سلام. از ${c} تماس می‌گیریم. آیا بی‌حسی ناحیه‌ی جراحی برطرف شده است؟ اگر هنوز بی‌حس است یا درد شدید دارید لطفاً اطلاع دهید.`,
  week:`${n}، سلام. از ${c} تماس می‌گیریم. حال عمومی شما بعد از جراحی چطور است؟ اگر تورم، درد یا خونریزی غیرعادی دارید لطفاً اطلاع دهید.`,
  suture:`${n}، سلام. از ${c} تماس می‌گیریم. زمان کشیدن بخیه‌ی شما رسیده است؛ لطفاً برای تعیین نوبت با ما هماهنگ کنید.`,
  uncover:`${n}، سلام. از ${c} تماس می‌گیریم. زمان آنکاوری ایمپلنت‌های شما رسیده است؛ لطفاً برای تعیین نوبت با ما هماهنگ کنید.`,
  pweek:`${n}، سلام. از ${c} تماس می‌گیریم. پروتز جدیدتان راحت است؟ اگر درد، لقی یا گیر کردن غذا دارید لطفاً اطلاع دهید.`,labready:`${n}، سلام. از ${c} تماس می‌گیریم. کار پروتز شما از لابراتوار آماده شده است؛ لطفاً برای تعیین نوبت با ما هماهنگ کنید.`,
  recall:`${n}، سلام. از ${c} تماس می‌گیریم. زمان چکاپ دوره‌ای ایمپلنت‌های شما رسیده است؛ معاینه‌ی منظم عمر ایمپلنت را بیشتر می‌کند. لطفاً برای تعیین نوبت با ما هماهنگ کنید.`,
  fol:`${n}، سلام. از ${c} تماس می‌گیریم. خواستیم بپرسیم درباره‌ی طرح درمانتان تصمیم گرفته‌اید؟ اگر سؤالی درباره‌ی درمان یا شرایط پرداخت دارید خوشحال می‌شویم کمک کنیم.`}[kind]||`${n}، سلام. از ${c} تماس می‌گیریم.`};

/* Iranian national ID checksum (warning only) */
function nidOk(v){const d=toEn(v||'').replace(/\D/g,'');return d.length===10}

