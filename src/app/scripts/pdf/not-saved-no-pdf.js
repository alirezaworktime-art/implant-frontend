/* ---------- m17: consultant outcome «مردد» (think / «تصمیم نگرفت») and «انصراف» (lost): after a successful save the plan PDF downloads on the consultant's device, same content and file name as the other outcomes (owner, 2026-11-11); download only, nothing stored on the server ---------- */
{ const _m17su = sendUndecided; sendUndecided = async function (t) { const F0 = F, nm = String((F0 && F0.h && F0.h.name) || '').trim();
  const r = await _m17su.apply(this, arguments);
  try { if (F === F0 || !nm || !$('unSheet').hidden) return r; /* not saved: no PDF */
    const j = jalali(new Date()), fname = `${safeName(nm)} - ${j.dash}.pdf`, R = Object.assign({}, F0, { jalali: j.slash, pdfName: fname });
    const pdf = await buildPDF(R, { jalali: j.slash }); downloadBlob(pdf.blob, fname) }
  catch (e) { alertMsg('ثبت انجام شد ولی PDF ساخته نشد: ' + (e && e.message || e)) }
  return r } }
