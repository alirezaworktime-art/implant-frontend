/* ---------- m41b (owner, 2026-11-17): paper file — earlier payments above the cost after discount show the patient in credit (as the server now stores),
   unless the file says «حساب تسویه است» or gives a remaining debt. ---------- */
(function(){
try{const _c=a6Calc;a6Calc=function(){const C=_c.apply(this,arguments);try{const S=A6;if(!S.settled&&(S.rem===''||S.rem==null)){C.m41over=0;C.bal=C.net-C.imp-C.paid}}catch(e){}return C};
  const _m=a6MoneyHTML;a6MoneyHTML=function(){let h=_m.apply(this,arguments);try{const C=a6Calc();if(C.bal<0){
    const hint=`<p class="m41hint" id="m41bCr">پرداخت‌ها ${fa(-C.bal)} تومان بیشتر از هزینه پس از تخفیف است؛ بیمار همین مقدار <b>بستانکار</b> ثبت می‌شود و در درمان بعدی از بدهی او کم می‌شود.</p>`;
    h=h.replace('<div class="a6sum"><span>جمع پرداخت‌ها</span>',hint+'<div class="a6sum"><span>جمع پرداخت‌ها</span>')}}catch(e){}return h}}catch(e){console.error('m41b',e)}
})();
