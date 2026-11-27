/* ---------- patch-flow3: روند بی‌گم‌شدگی — نیامد، نوبت‌های گذشته، پروتز بی‌نوبت، لاب دیرکرده، ترخیص ۷ روزه، رضایت‌نامه/پرداخت، بازگشت بیماران ---------- */
let QPAST=[],QPIDLE=[],QLAB=[],QLABN=[];
const PR_AK={impr:'impr',tryin:'tryin',rabt:'rabt',deliv:'deliv',lab:'tryin',heal:'uncover'};
const f3Days=d=>{const n=dDiff(tDay(),String(d||'').slice(0,10));return isFinite(n)?n:0};
function f3Items(R,td){
  // appointments in the past that were never resolved
  QPAST.forEach(a=>R.push({pid:a.plan,c:SG_K.includes(a.kind)?'surg':kGrp(a.kind)==='pr'?'pros':'chk',name:a.name,why:`نوبت ${esc(AKL[a.kind]||a.kind)} ${esc(jDay(a.day))}${a.time?' '+faD(a.time):' · بدون ساعت'} · <b class="late">نتیجه ثبت نشده (${fa(f3Days(a.day))} روز پیش)</b>`,w:50,
    act:`<button class="btn sm main" type="button" data-ast="done" data-aid="${esc(a.id)}">انجام شد</button>`,extra:tel(a.phone)+`<button class="btn sm ghost" type="button" data-ast="noshow" data-aid="${esc(a.id)}">نیامد</button>`}));
  // prosthesis stage without a booked appointment
  QPIDLE.forEach(x=>x.stage==='lab'?R.push({pid:x.id,c:'pros',name:x.name,why:`قالب گرفته شده؛ ${fa(x.days)} روز است سفارش لابراتوار ثبت نشده — به پزشک پروتز یادآوری کنید`,w:35+Math.min(x.days,20),act:fileBtn(x.id,x.name,'pros'),extra:tel(x.phone)}):R.push({pid:x.id,c:'pros',name:x.name,why:`${fa(x.days)} روز در مرحله‌ی «${esc(PSTN[x.stage]||x.stage)}» بدون نوبت`,w:35+Math.min(x.days,20),
    act:`<button class="btn sm main" type="button" data-pbook="${esc(x.id)}" data-pbn="${esc(x.name)}" data-pbp="${esc(x.phone||'')}" data-pbk="${PR_AK[x.stage]||'tryin'}">تعیین نوبت ${esc(AKL[PR_AK[x.stage]]||'')}</button>`,extra:tel(x.phone)+fileBtn(x.id,x.name,'pros')}));
  // lab orders past their due date
  QLAB.forEach(l=>R.push({pid:l.plan,c:'pros',name:l.name,why:`کار لابراتوار ${fa(f3Days(l.due))} روز از موعد گذشته · ${esc(LST[l.st]||l.st)}`,w:30+Math.min(f3Days(l.due),20),act:fileBtn(l.plan,l.name,'pros').replace('class="btn sm ghost"','class="btn sm main"'),extra:''}));
}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-pbook]');if(!t)return;openAppt({plan:t.dataset.pbook,name:t.dataset.pbn,phone:t.dataset.pbp,kind:t.dataset.pbk||'tryin',note:t.dataset.pbnote||''})});
/* clinic owes: show paid refunds etc. handled in pay3; here: labels for the new task kinds */
Object.assign(TLBL,{reno:['نیامد؛ نوبت دوباره','بیمار سر نوبت نیامد. تماس بگیرید و نوبت تازه بدهید.'],fol3:['پیگیری سوم (دو ماه بعد)','تماس بگیرید و درباره‌ی تصمیم بیمار بپرسید؛ اگر باز هم تصمیم نگرفت، به «بازگشت بیماران» می‌رود.'],impr:['نوبت قالب‌گیری','ایمپلنت‌ها با هیلینگ کار گذاشته شده و انکاوری لازم ندارند؛ برای قالب‌گیری نوبت بدهید.']});
Object.assign(TGRP,{reno:'sg',fol3:'fl',impr:'pr'});
AKL.visit='ویزیت اول';

