/* ---------- install as app (Android / iPhone) ---------- */
(function(){const el=$('appGet');if(!el)return;const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&'ontouchend' in document),and=/Android/.test(ua);
  const standalone=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
  if(IN_APP||standalone){el.hidden=true;return}
  let deferred=null;const parts=[];
  if(and)parts.push('<a href="implant-plan.apk" download="implant-plan.apk">دانلود اپلیکیشن اندروید (APK)</a>');
  if(ios)parts.push('<span>نصب روی آیفون: در Safari دکمه‌ی اشتراک‌گذاری <b>⎋</b> ← «Add to Home Screen» را بزنید.</span>');
  el.innerHTML=parts.join('')+'<button type="button" id="pwaInstall" hidden>نصب روی همین دستگاه</button>';el.hidden=!parts.length;
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const b=$('pwaInstall');b.hidden=false;el.hidden=false});
  el.addEventListener('click',e=>{if(e.target.id==='pwaInstall'&&deferred){deferred.prompt();deferred.userChoice.finally(()=>{deferred=null;e.target.hidden=true})}})})();

