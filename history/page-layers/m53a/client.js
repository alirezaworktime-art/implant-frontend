/* ---------- m53a (owner, 2026-11-18): names of the new reception tasks (made by the server):
   stuckq = a patient left in the doctor's / consultant's queue from an earlier day; stucks = sent to the surgery room, no session recorded;
   nodis = prosthesis work recorded although discharge / settlement of the surgery is still open. ---------- */
try { Object.assign(TLBL, { stuckq: ['بیمار از روزهای قبل در صف مانده', 'این بیمار بدون طرح درمان یا بدون تصمیم مشاور رفته است. تماس بگیرید؛ اگر برمی‌گردد نوبت بدهید، وگرنه از صف بردارید یا مشاور «تصمیم نگرفت» بزند.'],
  stucks: ['در اتاق جراحی مانده؛ جلسه ثبت نشده', 'بیمار به جراحی ارجاع شده ولی جلسه‌ی جراحی ثبت نشده است. از اتاق جراحی بپرسید: جلسه ثبت شود یا «جراحی انجام نشد» زده شود.'],
  nodis: ['پروتز شروع شد؛ ترخیص یا تسویه‌ی جراحی مانده', 'برای این بیمار کار پروتز ثبت شد ولی ترخیص یا تسویه‌ی اختلاف هزینه‌ی جراحی انجام نشده است. تعیین تکلیف کنید.'] });
  Object.assign(TGRP, { stuckq: 'fl', stucks: 'sg', nodis: 'fl' }) } catch (e) { }
