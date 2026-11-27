
/* ---------- pk6: «تعامل لابراتوار و پزشک» — after login the first tile («ثبت مشکل تازه») stayed on «در حال بارگذاری…»: lfLoad() re-draws softly, and the soft
   draw skips the «new» form to keep typed text; when nothing but the placeholder is on screen, draw fully. ---------- */
{const _r=lfRender;lfRender=function(soft){try{const el=$('lfRoot');if(soft&&LF&&LF.d&&el&&!el.querySelector('input,textarea,select,.lfcase,.card .btn')&&/در حال بارگذاری/.test(el.textContent||''))soft=false}catch(e){}return _r.call(this,soft)}}
