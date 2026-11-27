/* ---------- m44a (owner, 2026-11-17): surgery sheet — «فیل اولیه» + «کاشت» on one tooth are two fixtures, each with its own brand and size. In the
   implant window, with «فیل اولیه» and «فیکسچر دوم کاشته شد», the second fixture can be chosen apart (default: the same as the first). Both leave the
   store; the patient pays the tariff of the brand that was placed. ---------- */
(function(){
const M={ci:'',b:'',sys:'',d:'',l:''};
const cat=()=>{try{return catM()}catch(e){return []}};
const cur=()=>{const c=cat()[M.ci];return c||null};
function ui(){const rw=$('ex1RepW');if(!rw)return;let w=$('m44W');
  if(!w){rw.insertAdjacentHTML('afterend',`<div id="m44W" class="m44w" hidden><small>فیکسچر دوم — همانی که بعد از فیل، روی همین دندان کاشته شد</small>
    <select id="m44cat" aria-label="برند فیکسچر دوم"></select><input id="m44b" placeholder="برند فیکسچر دوم" hidden>
    <div class="m44g" id="m44G" hidden><input id="m44d" list="m44dL" inputmode="decimal" placeholder="قطر" aria-label="قطر فیکسچر دوم"><input id="m44l" list="m44lL" inputmode="decimal" placeholder="طول" aria-label="طول فیکسچر دوم"></div>
    <datalist id="m44dL"></datalist><datalist id="m44lL"></datalist><small id="m44St" hidden></small></div>`);w=$('m44W')}
  const show=!rw.hidden&&IMPRS==='fail'&&Number(EX1_IMP.rep)===1;w.hidden=!show;if(!show)return;
  const S=$('m44cat'),C=cat();S.innerHTML='<option value="">همان برند و سایز فیکسچر اول</option>'+C.map((c,i)=>`<option value="${i}">${esc(c.b+(c.sys?' · '+c.sys:''))}${GRPN[c.g]?' ('+GRPN[c.g]+')':''}</option>`).join('')+'<option value="m">سایر (نوشتن دستی)</option>';S.value=M.ci;
  const on=M.ci!=='',c=cur();$('m44b').hidden=M.ci!=='m';$('m44G').hidden=!on;$('m44b').value=M.b;$('m44d').value=M.d;$('m44l').value=M.l;
  $('m44dL').innerHTML=c&&c.d?c.d.map(x=>`<option value="${esc(x)}">`).join(''):'';let LL=[];try{LL=(c&&catLens(c,toEn(M.d).trim()))||[]}catch(e){}$('m44lL').innerHTML=LL.map(x=>`<option value="${esc(x)}">`).join('');
  stock()}
function stock(){const el=$('m44St');if(!el)return;const c=cur(),b=c?c.b:M.b,sys=c?c.sys:'',d=toEn(M.d).trim(),l=toEn(M.l).trim();if(M.ci===''||!INV.loaded||!b||!d||!l){el.hidden=true;return}
  const i=INV.items.find(x=>x.kind==='fix'&&sysKey(x.b,x.sys)===sysKey(b,sys)&&nk(x.d)===nk(d)&&nk(x.l)===nk(l)),q=i?Number(i.qty)||0:0;el.hidden=false;el.style.color=q>0?'':'var(--bad)';
  el.textContent=q>0?`موجودی انبار فیکسچر دوم: ${fa(q)} عدد (با ثبت جلسه یکی کم می‌شود)`:'فیکسچر دوم با این سایز در انبار موجود نیست؛ با ثبت جلسه موجودی منفی می‌شود و انباردار باخبر می‌شود.'}
const spec=()=>{if(M.ci==='')return null;const c=cur();return {b:c?c.b:M.b.trim(),sys:c?c.sys:'',g:c?c.g:'',d:toEn(M.d).trim(),l:toEn(M.l).trim()}};
{const _o=openImp;openImp=function(k,sid){const r=_o.apply(this,arguments);try{const m=(SURG&&SURG.imp[k])||{},f=m.f2;M.ci='';M.b='';M.sys='';M.d='';M.l='';
  if(f&&f.b){const i=cat().findIndex(c=>c.b===f.b&&(c.sys||'')===(f.sys||''));M.ci=i>=0?String(i):'m';M.b=f.b;M.sys=f.sys||'';M.d=f.d||'';M.l=f.l||''}ui()}catch(e){console.error('m44a open',e)}return r}}
try{const _u=ex1ImpUI;ex1ImpUI=function(){const r=_u.apply(this,arguments);try{ui()}catch(e){}return r}}catch(e){console.error('m44a',e)}
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.id)return;if(t.id==='m44cat'){M.ci=t.value;if(M.ci!=='m')M.b='';const c=cur();if(c){if(c.d&&M.d&&!c.d.includes(M.d))M.d='';M.l=''}ui()}});
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.id)return;if(t.id==='m44b')M.b=t.value;else if(t.id==='m44d'){M.d=t.value;const c=cur();let LL=[];try{LL=(c&&catLens(c,toEn(M.d).trim()))||[]}catch(x){}$('m44lL').innerHTML=LL.map(x=>`<option value="${esc(x)}">`).join('')}else if(t.id==='m44l')M.l=t.value;else return;stock()});
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('#ex1RepW [data-ex1rep]');if(t)setTimeout(()=>{try{ui()}catch(x){}},0)});
{const _v=impSave;impSave=function(){let f=null;try{if(SURG&&IMPRS==='fail'&&Number(EX1_IMP.rep)===1){f=spec();if(f&&(!f.b||!f.d||!f.l)){const m=$('impMsg');m.className='msg err';m.textContent=!f.b?'برند فیکسچر دوم را بنویسید.':'قطر و طول فیکسچر دوم را وارد کنید (یا «همان برند و سایز فیکسچر اول»).';return}}}catch(e){f=null}
  const k=IMPK,r=_v.apply(this,arguments);try{const m=SURG&&SURG.imp[k];if(m&&$('impSheet').hidden){if(f&&m.rs==='fail'&&Number(m.rep)){m.f2=f;if(f.g){m.g1=m.g||'';m.g=f.g}}else{delete m.f2;delete m.g1}renderImps()}}catch(e){console.error('m44a save',e)}return r}}
const f2Txt=f=>[f.b,f.sys].filter(Boolean).join(' ')+` · Ø${f.d} × L${f.l}`;
{const _r=renderImps;renderImps=function(){const r=_r.apply(this,arguments);try{document.querySelectorAll('#sgImps [data-impedit],#m31Pf [data-m31t]').forEach(b=>{const m=SURG&&SURG.imp[b.dataset.impedit||b.dataset.m31t];if(m&&m.f2&&m.f2.b&&!b.querySelector('.m44t'))b.insertAdjacentHTML('beforeend','<small class="ex1tag m44t"> · فیکسچر دوم: '+esc(f2Txt(m.f2))+'</small>')})}catch(e){}return r}}
window.m44a={state:()=>M,f2Txt};
})();
