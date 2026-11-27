
/* ---------- m23 (owner, 2026-11-13): lab ↔ prosthesis — paused-prosthesis warning on lab orders, «اصلاح» before the lab starts is an edit, past delivery date and same-day impression ask first ---------- */
function m23Pz(d){const z=d&&d.pz;if(!z)return '';return `<span class="m23pz" title="${esc(z.note||'')}">پروتز بیمار متوقف است${z.stop?' — بیمار ادامه نمی‌دهد':z.until?' · تماس دوباره '+esc(jDay(z.until)):''}</span>`}
{const _s=labSpecs;labSpecs=function(d){return m23Pz(d)+_s.apply(this,arguments)}}
{const _b=typeof l5Badges==='function'?l5Badges:null;if(_b)l5Badges=function(x){let h=_b.apply(this,arguments)||'';try{h=m23Pz(x&&x.data)+h}catch(e){}return h}}
{const _h=typeof l6BenchHTML==='function'?l6BenchHTML:null;if(_h)l6BenchHTML=function(){let h=_h.apply(this,arguments);try{(LB.items||[]).forEach(x=>{const z=m23Pz(x&&x.data);if(!z)return;const i=h.indexOf(`<td class="tnum"><b>${l2No(x.no)}</b>`);if(i<0)return;const e=h.indexOf('</tr>',i),j=h.indexOf('<span class="pill ',i);if(j>0&&(e<0||j<e))h=h.slice(0,j)+`<div class="m23pzr">${z}</div>`+h.slice(j)})}catch(e){}return h}}
let M23_E0=0;
{const _a=api;api=async function(action,payload={},opt={}){
  if(action!=='labNew'&&action!=='prosSess'&&action!=='labSet')return _a(action,payload,opt);
  let p=payload;
  for(let i=0;i<4;i++){
    try{const r=await _a(action,p,opt);if(action==='labSet'&&r&&r.edit0)M23_E0=Date.now();return r}
    catch(e){const m=/^(DUEPAST|SAMEDAY)\|([^|]*)\|([\s\S]*)$/.exec((e&&e.message)||'');if(!m)throw e;
      const due=m[1]==='DUEPAST';
      const ok=await uxAsk({title:due?'تاریخ تحویل گذشته است':'قالب‌گیری در روز جراحی',msg:m[3],ok:due?'بله، همین تاریخ ثبت شود':'بله، امروز قالب گرفته شد',cancel:'نه، برمی‌گردم'});
      if(!ok)throw new Error(due?'ثبت نشد؛ تاریخ تحویل را اصلاح کنید.':'ثبت نشد.');
      p=Object.assign({},p||{},due?{duePast:1}:{sameDay:1})}}
  throw new Error('ثبت نشد؛ دوباره تلاش کنید.')}}
{const _t=toast;toast=function(t,bad){if(M23_E0&&Date.now()-M23_E0<5000&&!bad&&/^وضعیت سفارش/.test(String(t||''))){M23_E0=0;t='لابراتوار هنوز این سفارش را شروع نکرده بود؛ اصلاح به‌عنوان ویرایش سفارش ثبت شد و برگشتی حساب نمی‌شود.'}return _t.call(this,t,bad)}}
